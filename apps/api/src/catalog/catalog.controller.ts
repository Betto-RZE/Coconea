import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CatalogService } from "./catalog.service.js";
import { RestaurantGuard } from "./restaurant.guard.js";
import type { RestaurantRequest } from "./restaurant.guard.js";

@Controller()
export class PublicCatalogController {
  constructor(
    @Inject(CatalogService) private readonly catalog: CatalogService,
  ) {}
  @Get("restaurants") async list(
    @Query("search") search?: string,
    @Query("category_id") category?: string,
  ) {
    return { data: await this.catalog.list(search, category) };
  }
  @Get("restaurants/:id") async restaurant(@Param("id") id: string) {
    return { data: await this.catalog.restaurant(id) };
  }
  @Get("restaurants/:id/products") async products(@Param("id") id: string) {
    return { data: (await this.catalog.restaurant(id)).products };
  }
  @Get("products/:id") async product(@Param("id") id: string) {
    return { data: await this.catalog.product(id) };
  }
}

@Controller("restaurant/me")
@UseGuards(RestaurantGuard)
export class RestaurantCatalogController {
  constructor(
    @Inject(CatalogService) private readonly catalog: CatalogService,
  ) {}
  @Get() async profile(@Req() req: RestaurantRequest) {
    return {
      data: await this.catalog.restaurant(req.restaurantIdentity.restaurantId),
    };
  }
  @Patch() async updateProfile(
    @Req() req: RestaurantRequest,
    @Body() body: unknown,
  ) {
    return {
      data: await this.catalog.updateRestaurant(
        req.restaurantIdentity.restaurantId,
        req.restaurantIdentity.userId,
        body,
      ),
    };
  }
  @Get("products") async list(@Req() req: RestaurantRequest) {
    return {
      data: (await this.catalog.restaurant(req.restaurantIdentity.restaurantId))
        .products,
    };
  }
  @Post("products") async create(
    @Req() req: RestaurantRequest,
    @Body() body: unknown,
  ) {
    return {
      data: await this.catalog.create(
        req.restaurantIdentity.restaurantId,
        req.restaurantIdentity.userId,
        body,
      ),
    };
  }
  @Patch("products/:id") async update(
    @Req() req: RestaurantRequest,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    return {
      data: await this.catalog.update(
        req.restaurantIdentity.restaurantId,
        req.restaurantIdentity.userId,
        id,
        body,
      ),
    };
  }
}
