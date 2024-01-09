import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule } from '@nestjs/swagger';
import { options } from './utility/swagger/config/options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const document = SwaggerModule.createDocument(app, options);

  document.tags = []

  // Remove the default "default" path
  delete document.paths['/'];
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 }
  });

  app.enableCors()
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  await app.listen(3000);
}
bootstrap();

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzA0ODMzODkzLCJleHAiOjE3MDUwMDY2OTN9.4ie2icZ_G9qmnO0UiQE8dxOniaeGGctDoAtJA2G4y4c
