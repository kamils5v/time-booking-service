import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || `/api/v1`);
  await bootstrapSwagger(app);
  await app.listen(3000);
}

async function bootstrapSwagger(app: INestApplication) {
  const version: string = process.env.npm_package_version || '';

  const config = new DocumentBuilder()
    .setTitle('Time booking service')
    .setDescription('API description')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const options = {
    explorer: true,
  };
  return SwaggerModule.setup('api/docs', app, document, options);
}

bootstrap();
