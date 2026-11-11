import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module.js";
import { DatabaseModule } from "./database/database.module.js";
import { CatalogModule } from "./catalog/catalog.module.js";
import { OrdersModule } from "./orders/orders.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    HealthModule,
    DatabaseModule,
    CatalogModule,
    OrdersModule,
  ],
})
export class AppModule {}
