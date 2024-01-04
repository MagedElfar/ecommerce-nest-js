import { DocumentBuilder } from '@nestjs/swagger';

export const options = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api', 'Local environment')
    .addBearerAuth()
    .build();
