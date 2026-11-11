import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly connectionString =
    process.env.DATABASE_URL ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "postgresql://coconea:coconea_local_dev@localhost:5432/coconea_db");
  readonly pool = new pg.Pool({
    connectionString: this.connectionString,
    max: 10,
    connectionTimeoutMillis: 5000,
  });
  readonly db = drizzle(this.pool, { schema });
  constructor() {
    this.pool.on("error", () => {
      /* Idle clients are discarded by pg; subsequent requests reconnect. */
    });
    if (!this.connectionString)
      throw new Error("Configura DATABASE_URL antes de iniciar la API.");
  }
  async onModuleDestroy() {
    await this.pool.end();
  }
}
