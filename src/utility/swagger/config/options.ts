import { DocumentBuilder } from '@nestjs/swagger';

export const options = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api', 'Local environment')
    .addBearerAuth(
        {
            description: `[just text field] Please enter token in following format: Bearer <JWT>`,
            name: 'Authorization',
            bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
            scheme: 'Bearer',
            type: 'http', // I`ve attempted type: 'apiKey' too
            in: 'Header'
        },
        'access-token',
    )
    .build();
