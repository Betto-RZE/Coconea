import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { toNodeHandler } from "better-auth/node";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import {
  IdentityService,
  allowedOrigins,
} from "./identity/identity.service.js";
import { HttpErrorFilter } from "./http-error.filter.js";

export async function createApplication(logging = true) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    ...(logging ? {} : { logger: false }),
  });
  app.enableCors({ origin: allowedOrigins(), credentials: true });
  const identity = app.get(IdentityService);
  app
    .getHttpAdapter()
    .getInstance()
    .all("/v1/auth/*", toNodeHandler(identity.auth));
  app.useBodyParser("json", { limit: "64kb" });
  app.setGlobalPrefix("v1");
  app.useGlobalFilters(new HttpErrorFilter());
  app.use(
    (
      _req: unknown,
      res: { setHeader: (key: string, value: string) => void },
      next: () => void,
    ) => {
      res.setHeader("Cache-Control", "no-store");
      next();
    },
  );
  const config = new DocumentBuilder()
    .setTitle("Coconea API")
    .setVersion("1.0")
    .addCookieAuth("coconea.session_token")
    .build();
  SwaggerModule.setup(
    "v1/docs",
    app,
    SwaggerModule.createDocument(app, config),
  );
  app.enableShutdownHooks();
  return app;
}
