import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version, name } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // set Access-Control-Expose-Headers: Content-Length
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  configSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}


function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription('Sistema de gestión para nutricionistas')
    .setVersion(version)
    .addSecurity('bearer', { type: 'http', scheme: 'bearer', in: 'headers' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`v1/doc`, app, document);
}
bootstrap();
