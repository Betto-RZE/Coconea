import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { config } from "dotenv";
import { randomBytes, randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";
import request from "supertest";
import { hashPassword } from "better-auth/crypto";
import { createApplication } from "../src/application.js";
import {
  user,
  account,
  restaurants,
  products,
  auditEvents,
  ingredients,
  productIngredients,
} from "../src/database/schema.js";
import type { NestExpressApplication } from "@nestjs/platform-express";

config({ path: "../../.env", quiet: true });
const databaseName = `coconea_test_${randomBytes(8).toString("hex")}`;
const originalDatabaseUrl = process.env.DATABASE_URL!;
const admin = new pg.Pool({ connectionString: originalDatabaseUrl });
admin.on("error", () => {});
let app: NestExpressApplication;
let pool: pg.Pool;
let cookie: string[];
let databaseCreated = false;
const password = "IntegrationTest!Only2026";
const origin = "http://localhost:3001";
const input = {
  name: "Producto editado",
  description: "Descripción actualizada desde el restaurante.",
  price: "145.50",
  category: "fuertes",
  image_url: "/images/menu/pizza.jpg",
  image_alt: "Pizza ilustrativa",
  availability_status: "AVAILABLE",
  ingredient_disclosure_status: "UNKNOWN",
  ingredients: [],
  allergens: [],
};
const signIn = (email: string, suppliedPassword = password) =>
  request(app.getHttpServer())
    .post("/v1/auth/sign-in/email")
    .set("Origin", origin)
    .send({ email, password: suppliedPassword });
const update = (id: string, body: unknown, suppliedOrigin = origin) =>
  request(app.getHttpServer())
    .patch(`/v1/restaurant/me/products/${id}`)
    .set("Cookie", cookie)
    .set("Origin", suppliedOrigin)
    .send(body);

describe("Catálogo local con PostgreSQL y sesiones Better Auth", () => {
  beforeAll(async () => {
    if (!originalDatabaseUrl)
      throw new Error("Configura DATABASE_URL para las pruebas aisladas.");
    await admin.query(`CREATE DATABASE "${databaseName}"`);
    databaseCreated = true;
    const url = new URL(originalDatabaseUrl);
    url.pathname = `/${databaseName}`;
    process.env.DATABASE_URL = url.toString();
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    pool.on("error", () => {});
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./drizzle" });
    const hash = await hashPassword(password);
    for (const [id, role] of [
      ["owner-a", "RESTAURANT"],
      ["owner-b", "RESTAURANT"],
      ["consumer", "USER"],
    ] as const) {
      await db.insert(user).values({
        id,
        name: id,
        email: `${id}@test.local`,
        emailVerified: true,
        role,
      });
      await db.insert(account).values({
        id: randomUUID(),
        userId: id,
        accountId: id,
        providerId: "credential",
        password: hash,
      });
    }
    for (const suffix of ["a", "b"]) {
      await db.insert(restaurants).values({
        id: `restaurant-${suffix}`,
        ownerAccountId: `owner-${suffix}`,
        name: `Restaurante ${suffix}`,
        description: "Restaurante de integración",
        category: "pizza",
        imageUrl: "/images/menu/pizza.jpg",
        imageAlt: "Pizza",
      });
      await db.insert(products).values({
        id: `product-${suffix}`,
        restaurantId: `restaurant-${suffix}`,
        name: `Producto ${suffix}`,
        description: "Producto inicial de prueba",
        price: "100.00",
        category: "fuertes",
        imageUrl: "/images/menu/pizza.jpg",
        imageAlt: "Pizza",
      });
    }
    app = await createApplication(false);
    await app.init();
    const response = await signIn("owner-a@test.local");
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
  });

  afterAll(async () => {
    if (app) await app.close().catch(() => {});
    if (pool) {
      pool.on("error", () => {});
      await pool.end().catch(() => {});
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    process.env.DATABASE_URL = originalDatabaseUrl;
    if (databaseCreated) {
      try {
        await admin.query(`DROP DATABASE "${databaseName}" WITH (FORCE)`);
      } catch {
        // Ignorar si la base de datos efímera ya fue removida
      }
    }
    await admin.end().catch(() => {});
  });

  it("acepta los filtros públicos de categoría y rechaza estructuras inválidas", async () => {
    const filtered = await request(app.getHttpServer()).get(
      "/v1/restaurants?category_id=cat_pizza&search=Restaurante%20a",
    );
    expect(filtered.status).toBe(200);
    expect(filtered.body.data.map((r: { id: string }) => r.id)).toEqual([
      "restaurant-a",
    ]);
    expect(
      (await request(app.getHttpServer()).get("/v1/restaurants?search[]=bad"))
        .status,
    ).toBe(400);
  });
  it("rechaza contraseñas incorrectas y deshabilita el registro público de restaurantes", async () => {
    expect(
      (await signIn("owner-a@test.local", "WrongPassword!2026")).status,
    ).toBe(401);
    const registration = await request(app.getHttpServer())
      .post("/v1/auth/sign-up/email")
      .set("Origin", origin)
      .send({
        name: "Intruso",
        email: "intruder@test.local",
        password,
        role: "RESTAURANT",
      });
    if (registration.status === 200) {
      expect(registration.body.user.role).toBe("USER");
      expect(
        (
          await request(app.getHttpServer())
            .get("/v1/restaurant/me")
            .set("Cookie", registration.headers["set-cookie"])
        ).status,
      ).toBe(403);
    } else expect(registration.status).toBeGreaterThanOrEqual(400);
  });
  it("exige sesión y deniega el rol de consumidor", async () => {
    expect(
      (await request(app.getHttpServer()).get("/v1/restaurant/me")).status,
    ).toBe(401);
    const login = await signIn("consumer@test.local");
    expect(login.status).toBe(200);
    expect(
      (
        await request(app.getHttpServer())
          .get("/v1/restaurant/me")
          .set("Cookie", login.headers["set-cookie"])
      ).status,
    ).toBe(403);
  });
  it("devuelve sólo el establecimiento propio en la ruta privada", async () => {
    const response = await request(app.getHttpServer())
      .get("/v1/restaurant/me")
      .set("Cookie", cookie);
    expect(response.body.data.id).toBe("restaurant-a");
    expect(
      response.body.data.products.map((p: { id: string }) => p.id),
    ).toEqual(["product-a"]);
  });
  it("bloquea IDOR y la inyección de propiedad", async () => {
    expect((await update("product-b", { ...input, version: 1 })).status).toBe(
      404,
    );
    expect(
      (
        await update("product-a", {
          ...input,
          version: 1,
          restaurant_id: "restaurant-b",
        })
      ).status,
    ).toBe(400);
    const db = drizzle(pool);
    const [untouched] = await db
      .select()
      .from(products)
      .where(eq(products.id, "product-b"));
    expect(untouched.price).toBe("100.00");
  });
  it("rechaza mutaciones desde orígenes ajenos y precios inválidos", async () => {
    expect(
      (
        await update(
          "product-a",
          { ...input, version: 1 },
          "https://untrusted.example",
        )
      ).status,
    ).toBe(403);
    expect(
      (await update("product-a", { ...input, version: 1, price: "-1.00" }))
        .status,
    ).toBe(400);
    expect(
      (
        await update("product-a", {
          ...input,
          version: 1,
          image_url: "javascript:alert(1)",
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await update("product-a", {
          ...input,
          version: 1,
          ingredient_disclosure_status: "COMPLETE",
        })
      ).status,
    ).toBe(400);
  });
  it("publica una edición persistida con precio decimal y auditoría", async () => {
    const response = await update("product-a", { ...input, version: 1 });
    expect(response.status).toBe(200);
    expect(response.body.data.price).toBe("145.50");
    expect(response.body.data.version).toBe(2);
    const published = await request(app.getHttpServer()).get(
      "/v1/products/product-a",
    );
    expect(published.body.data.name).toBe(input.name);
    const events = await drizzle(pool).select().from(auditEvents);
    expect(events).toHaveLength(1);
    expect(events[0].actorId).toBe("owner-a");
  });
  it("evita pérdida de datos ante ediciones simultáneas", async () => {
    const results = await Promise.all([
      update("product-a", {
        ...input,
        name: "Edición simultánea A",
        version: 2,
      }),
      update("product-a", {
        ...input,
        name: "Edición simultánea B",
        version: 2,
      }),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
  });
  it("crea productos propios y publica cambios de disponibilidad", async () => {
    const created = await request(app.getHttpServer())
      .post("/v1/restaurant/me/products")
      .set("Cookie", cookie)
      .set("Origin", origin)
      .send({ ...input, name: "Producto nuevo" });
    expect(created.status).toBe(201);
    expect(created.body.data.restaurant_id).toBe("restaurant-a");
    const response = await update(created.body.data.id, {
      ...input,
      name: "Producto nuevo",
      version: 1,
      availability_status: "UNAVAILABLE",
    });
    expect(response.status).toBe(200);
    const published = await request(app.getHttpServer()).get(
      `/v1/products/${created.body.data.id}`,
    );
    expect(published.body.data.availability_status).toBe("UNAVAILABLE");
  });
  it("conserva catálogo y sesión tras reiniciar la API", async () => {
    await app.close();
    app = await createApplication(false);
    await app.init();
    const response = await request(app.getHttpServer())
      .get("/v1/restaurant/me")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(
      response.body.data.products.find(
        (p: { id: string }) => p.id === "product-a",
      ).version,
    ).toBe(3);
  });
  it("registra consumidores con contraseña derivada y sesión persistente", async () => {
    const registered = await request(app.getHttpServer())
      .post("/v1/auth/sign-up/email")
      .set("Origin", "http://localhost:3000")
      .send({
        name: "Consumidor de prueba",
        email: "signup@test.local",
        password,
      });
    expect(registered.status).toBe(200);
    expect(registered.body.user.role).toBe("USER");
    expect(JSON.stringify(registered.body)).not.toContain(password);
    const db = drizzle(pool);
    const rows = await db
      .select()
      .from(account)
      .where(eq(account.userId, registered.body.user.id));
    expect(rows[0].password).not.toBe(password);
    expect(rows[0].password).toBeTruthy();
    const current = await request(app.getHttpServer())
      .get("/v1/auth/get-session")
      .set("Cookie", registered.headers["set-cookie"]);
    expect(current.body.user.email).toBe("signup@test.local");
    expect(
      (await request(app.getHttpServer()).get("/v1/usuarios")).status,
    ).toBe(404);
  });
  it("normaliza ingredientes y mantiene relaciones verificables", async () => {
    const firstId = randomUUID();
    const create = (ingredientId: string, name: string) =>
      request(app.getHttpServer())
        .post("/v1/restaurant/me/products")
        .set("Cookie", cookie)
        .set("Origin", origin)
        .send({
          ...input,
          name: "Producto con declaración",
          ingredient_disclosure_status: "COMPLETE",
          ingredients: [
            { ingredient_id: ingredientId, name, declaration_type: "CONTAINS" },
          ],
        });
    const first = await create(firstId, "Pollo");
    const second = await create(randomUUID(), "POLLO");
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body.data.ingredients[0].ingredient_id).toBe(firstId);
    expect(await drizzle(pool).select().from(ingredients)).toHaveLength(1);
    expect(await drizzle(pool).select().from(productIngredients)).toHaveLength(
      2,
    );
    expect((await create(firstId, "Otro ingrediente")).status).toBe(400);
  });
  it("deniega la sesión de una cuenta deshabilitada", async () => {
    const db = drizzle(pool);
    await db.update(user).set({ enabled: false }).where(eq(user.id, "owner-a"));
    try {
      expect(
        (
          await request(app.getHttpServer())
            .get("/v1/restaurant/me")
            .set("Cookie", cookie)
        ).status,
      ).toBe(403);
    } finally {
      await db
        .update(user)
        .set({ enabled: true })
        .where(eq(user.id, "owner-a"));
    }
  });
  it("revoca la sesión al salir", async () => {
    const logout = await request(app.getHttpServer())
      .post("/v1/auth/sign-out")
      .set("Cookie", cookie)
      .set("Origin", origin)
      .send({});
    expect(logout.status).toBe(200);
    expect(
      (
        await request(app.getHttpServer())
          .get("/v1/restaurant/me")
          .set("Cookie", cookie)
      ).status,
    ).toBe(401);
  });
});
