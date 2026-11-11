import { Injectable, Inject } from "@nestjs/common";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { DatabaseService } from "../database/database.service.js";
import * as schema from "../database/schema.js";

export function allowedOrigins() {
  return [
    process.env.CUSTOMER_WEB_URL || "http://localhost:3000",
    process.env.RESTAURANT_WEB_URL || "http://localhost:3001",
    process.env.DELIVERY_WEB_URL || "http://localhost:3002",
    process.env.ADMIN_WEB_URL || "http://localhost:3003",
  ];
}

@Injectable()
export class IdentityService {
  readonly auth;
  constructor(@Inject(DatabaseService) database: DatabaseService) {
    if (
      !process.env.BETTER_AUTH_SECRET ||
      process.env.BETTER_AUTH_SECRET.length < 32
    )
      throw new Error(
        "Configura un BETTER_AUTH_SECRET seguro de al menos 32 caracteres.",
      );
    this.auth = betterAuth({
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
      basePath: "/v1/auth",
      secret: process.env.BETTER_AUTH_SECRET,
      database: drizzleAdapter(database.db, { provider: "pg", schema }),
      trustedOrigins: allowedOrigins(),
      emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
      },
      user: {
        additionalFields: {
          role: { type: "string", defaultValue: "USER", input: false },
          enabled: { type: "boolean", defaultValue: true, input: false },
        },
      },
      advanced: {
        cookiePrefix: "coconea",
        useSecureCookies: process.env.NODE_ENV === "production",
      },
      rateLimit: { enabled: true, storage: "memory" },
    });
  }
}
