import { DocumentBuilder } from '@nestjs/swagger';

export const options = new DocumentBuilder()
    .setTitle('ECommerce API')
    .setDescription('Our ECommerce API is designed to empower online businesses by providing a robust and flexible solution for managing products with dynamic variations and attributes. This API allows merchants to easily showcase and sell products with diverse specifications.')
    .setVersion('1.0')
    .addServer('https://nest-ecommerce-app.onrender.com/api', "Production environment")
    .addServer('http://localhost:3000/api', 'Local environment')
    .addBearerAuth()
    .build();
