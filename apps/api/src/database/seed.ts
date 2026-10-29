import { config } from "dotenv";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import shared from "@coconea/shared";
const { DEMO_RESTAURANTS } = shared;
import { DatabaseService } from "./database.service.js";
import { account, products, restaurants, user } from "./schema.js";

config({ path: "../../.env", quiet: true });
if (process.env.NODE_ENV === "production")
  throw new Error("Los datos de prueba no se cargan en producción.");
const database = new DatabaseService();
const emails: Record<string, string> = {
  "rest-raices": "mcdonalds@coconea.local",
  "rest-botanica": "subway@coconea.local",
  "rest-pacifico": "kfc@coconea.local",
  "rest-dominos": "dominos@coconea.local",
  "rest-greengrass": "greengrass@coconea.local",
};
const credentials: { restaurant: string; email: string; password: string }[] =
  [];
try {
  for (const restaurant of DEMO_RESTAURANTS) {
    const email = emails[restaurant.id];
    const [existing] = await database.db
      .select()
      .from(user)
      .where(eq(user.email, email));
    const id = existing?.id || randomUUID();
    const password = `Coconea!${randomBytes(12).toString("base64url")}`;
    const passwordHash = existing ? null : await hashPassword(password);
    await database.db.transaction(async (tx) => {
      if (!existing) {
        await tx.insert(user).values({
          id,
          name: restaurant.name,
          email,
          emailVerified: true,
          role: "RESTAURANT",
        });
        await tx.insert(account).values({
          id: randomUUID(),
          userId: id,
          accountId: id,
          providerId: "credential",
          password: passwordHash,
        });
      }
      await tx
        .insert(restaurants)
        .values({
          id: restaurant.id,
          ownerAccountId: id,
          name: restaurant.name,
          description: restaurant.tagline,
          category: restaurant.cuisineCategory,
          imageUrl: restaurant.image,
          imageAlt: restaurant.imageAlt,
        })
        .onConflictDoNothing();
      for (const [position, product] of restaurant.menu.entries()) {
        await tx
          .insert(products)
          .values({
            id: product.id,
            restaurantId: restaurant.id,
            name: product.name,
            description: product.description,
            price: product.price.toFixed(2),
            category: product.category,
            imageUrl: product.image,
            imageAlt: product.imageAlt,
            position,
          })
          .onConflictDoNothing();
      }
    });
    if (!existing)
      credentials.push({ restaurant: restaurant.name, email, password });
  }
  if (credentials.length) {
    await mkdir("../../tmp", { recursive: true });
    await writeFile(
      "../../tmp/restaurant-accounts.json",
      JSON.stringify(credentials, null, 2),
      { mode: 0o600 },
    );
  }
  console.log(
    "Catálogo inicial listo. Las credenciales nuevas están en tmp/restaurant-accounts.json (archivo local excluido de Git). Los usuarios y productos existentes se conservan.",
  );
} finally {
  await database.onModuleDestroy();
}
