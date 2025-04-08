import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    transform: true, // Transform payloads to DTO instances
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
