import {
  BadRequestException,
  ConflictException,
  Injectable,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { DatabaseService } from "../database/database.service.js";
import {
  restaurants,
  products,
  auditEvents,
  ingredients,
  productIngredients,
} from "../database/schema.js";
import {
  createProductSchema,
  updateProductSchema,
  updateRestaurantSchema,
} from "./catalog.validation.js";

export function productDto(product: typeof products.$inferSelect) {
  return {
    id: product.id,
    restaurant_id: product.restaurantId,
    name: product.name,
    description: product.description,
    price: product.price,
    currency: "MXN" as const,
    category: product.category,
    image_url: product.imageUrl,
    image_alt: product.imageAlt,
    availability_status: product.available ? "AVAILABLE" : "UNAVAILABLE",
    ingredient_disclosure_status: product.ingredientDisclosureStatus,
    ingredients: product.ingredients,
    allergens: product.allergens,
    version: product.version,
    updated_at: product.updatedAt.toISOString(),
  };
}

@Injectable()
export class CatalogService {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
  ) {}
  private parse<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
    const result = schema.safeParse(body);
    if (!result.success)
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Revisa los datos del formulario.",
        details: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    return result.data;
  }
  async list(search = "", category = "") {
    if (
      typeof search !== "string" ||
      typeof category !== "string" ||
      search.length > 120 ||
      category.length > 60
    )
      throw new BadRequestException("Filtros de búsqueda no válidos.");
    const [restaurantRows, productRows] = await Promise.all([
      this.database.db
        .select()
        .from(restaurants)
        .orderBy(asc(restaurants.createdAt), asc(restaurants.id)),
      this.database.db
        .select()
        .from(products)
        .orderBy(asc(products.position), asc(products.id)),
    ]);
    return restaurantRows
      .filter(
        (r) =>
          (!category ||
            r.category === category ||
            `cat_${r.category}` === category) &&
          (!search ||
            `${r.name} ${r.description}`
              .toLocaleLowerCase("es")
              .includes(search.toLocaleLowerCase("es"))),
      )
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        image_url: r.imageUrl,
        image_alt: r.imageAlt,
        version: r.version,
        updated_at: r.updatedAt.toISOString(),
        products: productRows
          .filter((p) => p.restaurantId === r.id)
          .map(productDto),
      }));
  }
  async restaurant(id: string) {
    const restaurant = (await this.list()).find((r) => r.id === id);
    if (!restaurant) throw new NotFoundException("Restaurante no encontrado.");
    return restaurant;
  }
  async product(id: string) {
    const [product] = await this.database.db
      .select()
      .from(products)
      .where(eq(products.id, id));
    if (!product) throw new NotFoundException("Producto no encontrado.");
    return productDto(product);
  }
  private productValues(input: z.infer<typeof createProductSchema>) {
    return {
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      imageUrl: input.image_url,
      imageAlt: input.image_alt,
      available: input.availability_status === "AVAILABLE",
      allergens: input.allergens,
      ingredientDisclosureStatus: input.ingredient_disclosure_status,
      updatedAt: new Date(),
    };
  }
  private async ingredientDeclarations(
    tx: Parameters<Parameters<DatabaseService["db"]["transaction"]>[0]>[0],
    declarations: z.infer<typeof createProductSchema>["ingredients"],
  ) {
    const result: {
      ingredient_id: string;
      name: string;
      declaration_type: "CONTAINS" | "MAY_CONTAIN";
    }[] = [];
    for (const declaration of declarations) {
      const [existing] = await tx
        .select()
        .from(ingredients)
        .where(eq(ingredients.id, declaration.ingredient_id));
      const normalize = (name: string) =>
        name
          .normalize("NFKC")
          .trim()
          .replace(/\s+/g, " ")
          .toLocaleLowerCase("es");
      if (
        existing &&
        (!existing.isActive ||
          (declaration.name &&
            normalize(declaration.name) !== existing.normalizedName))
      )
        throw new BadRequestException(
          "El ingrediente no coincide con su identificador.",
        );
      if (!existing && !declaration.name)
        throw new BadRequestException(
          "El ingrediente no existe; declara su nombre.",
        );
      if (!existing)
        await tx
          .insert(ingredients)
          .values({
            id: declaration.ingredient_id,
            name: declaration.name!,
            normalizedName: normalize(declaration.name!),
          })
          .onConflictDoNothing();
      const ingredient =
        existing ||
        (
          await tx
            .select()
            .from(ingredients)
            .where(eq(ingredients.normalizedName, normalize(declaration.name!)))
        )[0];
      if (!ingredient || !ingredient.isActive)
        throw new BadRequestException("Ingrediente no disponible.");
      if (
        !result.some(
          (item) =>
            item.ingredient_id === ingredient.id &&
            item.declaration_type === declaration.declaration_type,
        )
      )
        result.push({
          ingredient_id: ingredient.id,
          name: ingredient.name,
          declaration_type: declaration.declaration_type,
        });
    }
    return result;
  }
  private async replaceDeclarations(
    tx: Parameters<Parameters<DatabaseService["db"]["transaction"]>[0]>[0],
    productId: string,
    declarations: {
      ingredient_id: string;
      declaration_type: "CONTAINS" | "MAY_CONTAIN";
    }[],
  ) {
    await tx
      .delete(productIngredients)
      .where(eq(productIngredients.productId, productId));
    if (declarations.length)
      await tx.insert(productIngredients).values(
        declarations.map((item) => ({
          productId,
          ingredientId: item.ingredient_id,
          declarationType: item.declaration_type,
        })),
      );
  }
  async create(restaurantId: string, actorId: string, body: unknown) {
    const input = this.parse(createProductSchema, body);
    return this.database.db.transaction(async (tx) => {
      const declarations = await this.ingredientDeclarations(
        tx,
        input.ingredients,
      );
      const [created] = await tx
        .insert(products)
        .values({
          id: randomUUID(),
          restaurantId,
          ...this.productValues(input),
          ingredients: declarations,
        })
        .returning();
      await this.replaceDeclarations(tx, created.id, declarations);
      await tx.insert(auditEvents).values({
        id: randomUUID(),
        actorId,
        resourceId: created.id,
        action: "PRODUCT_CREATED",
        changes: input,
      });
      return productDto(created);
    });
  }
  async update(
    restaurantId: string,
    actorId: string,
    id: string,
    body: unknown,
  ) {
    const input = this.parse(updateProductSchema, body);
    return this.database.db.transaction(async (tx) => {
      const declarations = await this.ingredientDeclarations(
        tx,
        input.ingredients,
      );
      const [updated] = await tx
        .update(products)
        .set({
          ...this.productValues(input),
          ingredients: declarations,
          version: input.version + 1,
        })
        .where(
          and(
            eq(products.id, id),
            eq(products.restaurantId, restaurantId),
            eq(products.version, input.version),
          ),
        )
        .returning();
      if (!updated) {
        const [owned] = await tx
          .select({ id: products.id })
          .from(products)
          .where(
            and(eq(products.id, id), eq(products.restaurantId, restaurantId)),
          );
        if (!owned)
          throw new NotFoundException(
            "Producto no encontrado en tu restaurante.",
          );
        throw new ConflictException({
          code: "VERSION_CONFLICT",
          message:
            "El producto cambió en otra sesión. Recarga antes de guardar.",
        });
      }
      await this.replaceDeclarations(tx, id, declarations);
      await tx.insert(auditEvents).values({
        id: randomUUID(),
        actorId,
        resourceId: id,
        action: "PRODUCT_UPDATED",
        changes: input,
      });
      return productDto(updated);
    });
  }
  async updateRestaurant(restaurantId: string, actorId: string, body: unknown) {
    const input = this.parse(updateRestaurantSchema, body);
    await this.database.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(restaurants)
        .set({
          name: input.name,
          description: input.description,
          imageUrl: input.image_url,
          imageAlt: input.image_alt,
          version: input.version + 1,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(restaurants.id, restaurantId),
            eq(restaurants.version, input.version),
          ),
        )
        .returning();
      if (!updated)
        throw new ConflictException({
          code: "VERSION_CONFLICT",
          message:
            "El restaurante cambió en otra sesión. Recarga antes de guardar.",
        });
      await tx.insert(auditEvents).values({
        id: randomUUID(),
        actorId,
        resourceId: restaurantId,
        action: "RESTAURANT_UPDATED",
        changes: input,
      });
    });
    return this.restaurant(restaurantId);
  }
}
