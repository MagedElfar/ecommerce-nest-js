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
  SwaggerModule.setup('api-docs', app, document);

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
