import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Global prefix
  const globalPrefix = configService.get<string>('app.globalPrefix') || 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());

  // CORS FROM CONFIG
  app.enableCors({
    origin: configService.get<string[]>('app.corsOrigins'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Port from .env
  const port = configService.get<number>('app.port') || 3000;

  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
