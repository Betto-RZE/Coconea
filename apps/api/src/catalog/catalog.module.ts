import { Module } from "@nestjs/common";
import { CatalogService } from "./catalog.service.js";
import {
  PublicCatalogController,
  RestaurantCatalogController,
} from "./catalog.controller.js";
import { RestaurantGuard } from "./restaurant.guard.js";
import { IdentityService } from "../identity/identity.service.js";

@Module({
  controllers: [PublicCatalogController, RestaurantCatalogController],
  providers: [CatalogService, IdentityService, RestaurantGuard],
  exports: [IdentityService],
})
export class CatalogModule {}
