import { config } from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { DatabaseService } from "./database.service.js";
config({ path: "../../.env", quiet: true });
const database = new DatabaseService();
try {
  await migrate(database.db, { migrationsFolder: "./drizzle" });
  console.log("Migraciones de Coconea aplicadas.");
} finally {
  await database.onModuleDestroy();
}
