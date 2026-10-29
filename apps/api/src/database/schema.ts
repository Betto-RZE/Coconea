import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const user = pgTable(
  "auth_user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    role: text("role").notNull().default("USER"),
    enabled: boolean("enabled").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    check(
      "user_role",
      sql`${t.role} in ('USER', 'RESTAURANT', 'DELIVERY', 'ADMIN')`,
    ),
  ],
);

export const session = pgTable(
  "auth_session",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "auth_account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("account_provider_unique").on(t.providerId, t.accountId),
    index("account_user_idx").on(t.userId),
  ],
);

export const verification = pgTable(
  "auth_verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

export const restaurants = pgTable("restaurant", {
  id: text("id").primaryKey(),
  ownerAccountId: text("owner_account_id")
    .notNull()
    .unique()
    .references(() => user.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  metadata: jsonb("metadata")
    .$type<Record<string, string | number>>()
    .notNull()
    .default({}),
  version: integer("version").notNull().default(1),
  ...timestamps,
});

export const products = pgTable(
  "product",
  {
    id: text("id").primaryKey(),
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    category: text("category").notNull(),
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull(),
    available: boolean("available").notNull().default(true),
    ingredients: jsonb("ingredients")
      .$type<
        {
          ingredient_id: string;
          name: string;
          declaration_type: "CONTAINS" | "MAY_CONTAIN";
        }[]
      >()
      .notNull()
      .default([]),
    allergens: jsonb("allergens").$type<string[]>().notNull().default([]),
    ingredientDisclosureStatus: text("ingredient_disclosure_status")
      .notNull()
      .default("UNKNOWN"),
    position: integer("position").notNull().default(0),
    version: integer("version").notNull().default(1),
    ...timestamps,
  },
  (t) => [
    index("product_restaurant_idx").on(t.restaurantId),
    check("price_positive", sql`${t.price} > 0`),
    check(
      "product_category",
      sql`${t.category} in ('fuertes', 'complementos', 'postres', 'bebidas')`,
    ),
    check(
      "product_disclosure",
      sql`${t.ingredientDisclosureStatus} in ('UNKNOWN', 'PARTIAL', 'COMPLETE')`,
    ),
  ],
);

export const auditEvents = pgTable("audit_event", {
  id: text("id").primaryKey(),
  actorId: text("actor_id")
    .notNull()
    .references(() => user.id),
  resourceId: text("resource_id").notNull(),
  action: text("action").notNull(),
  changes: jsonb("changes").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ingredients = pgTable("ingredient", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull().unique(),
  allergenFlag: boolean("allergen_flag").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
});
export const productIngredients = pgTable(
  "product_ingredient",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    ingredientId: text("ingredient_id")
      .notNull()
      .references(() => ingredients.id),
    declarationType: text("declaration_type").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.ingredientId, t.declarationType] }),
    check(
      "ingredient_declaration_type",
      sql`${t.declarationType} in ('CONTAINS', 'MAY_CONTAIN')`,
    ),
  ],
);
