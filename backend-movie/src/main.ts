// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Dùng NestExpressApplication để xài static assets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8000;

  // ✅ Global ValidationPipe (từ project Mongo)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // cho DTO tự cast kiểu number, boolean...
    }),
  );

  // ✅ Global prefix cho API (giống Mongo)
  // Tất cả route sẽ thành: /api/xxx
  app.setGlobalPrefix('api');

  // ✅ Swagger (từ XAMPP) – đổi path docs cho đỡ trùng /api prefix
  const config = new DocumentBuilder()
    .setTitle('Movie Ticket Admin API')
    .setDescription('API quản lý rạp phim, user, ghế, doanh thu và auth')
    .setVersion('1.0')
    .addBearerAuth() // để test JWT trên Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI sẽ ở: http://localhost:8000/api-docs
  SwaggerModule.setup('api-docs', app, document);

  // ✅ Static assets: cho phép truy cập thư mục uploads (poster phim, vv.)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ CORS cho Next.js (gộp cả 2 bên, ưu tiên cho FE ở http://localhost:3000)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📘 Swagger UI: http://localhost:${port}/api-docs`);
}
bootstrap();
