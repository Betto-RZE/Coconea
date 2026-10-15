import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CoconeaBootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefijo global de la API según especificación contractual
  app.setGlobalPrefix('v1');

  // Habilitar CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Configuración de OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('Coconea API')
    .setDescription('API REST de la plataforma Coconea — Planifica tu alimentación, confirma y recibe.')
    .setVersion('1.0')
    .addTag('Health')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Coconea API lista en: http://localhost:${port}/v1`);
  logger.log(`📄 Documentación Swagger disponible en: http://localhost:${port}/v1/docs`);
}

bootstrap();
