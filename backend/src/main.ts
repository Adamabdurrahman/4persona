import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require('express-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Session middleware — diperlukan oleh Passport Google OAuth
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'session_secret_dev',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }, // 1 menit (hanya untuk OAuth flow)
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — izinkan request dari frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global prefix untuk semua routes API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}

bootstrap();

