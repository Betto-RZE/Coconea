import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
  UnauthorizedException,
} from "@nestjs/common";
import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import type { Request } from "express";
import {
  IdentityService,
  allowedOrigins,
} from "../identity/identity.service.js";
import { DatabaseService } from "../database/database.service.js";
import { restaurants, user } from "../database/schema.js";

export interface RestaurantRequest extends Request {
  restaurantIdentity: { userId: string; restaurantId: string };
}

@Injectable()
export class RestaurantGuard implements CanActivate {
  constructor(
    @Inject(IdentityService) private readonly identity: IdentityService,
    @Inject(DatabaseService) private readonly database: DatabaseService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RestaurantRequest>();
    const authSession = await this.identity.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!authSession)
      throw new UnauthorizedException(
        "Inicia sesión para administrar tu restaurante.",
      );
    const [owner] = await this.database.db
      .select({ role: user.role, enabled: user.enabled })
      .from(user)
      .where(eq(user.id, authSession.user.id));
    if (!owner || !owner.enabled || owner.role !== "RESTAURANT")
      throw new ForbiddenException(
        "Tu cuenta no está habilitada como restaurante.",
      );
    const [restaurant] = await this.database.db
      .select({ id: restaurants.id })
      .from(restaurants)
      .where(eq(restaurants.ownerAccountId, authSession.user.id));
    if (!restaurant)
      throw new ForbiddenException(
        "Tu cuenta no tiene un restaurante asignado.",
      );
    if (
      !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
      !allowedOrigins().includes(request.headers.origin || "")
    )
      throw new ForbiddenException("Origen de solicitud no autorizado.");
    request.restaurantIdentity = {
      userId: authSession.user.id,
      restaurantId: restaurant.id,
    };
    return true;
  }
}
