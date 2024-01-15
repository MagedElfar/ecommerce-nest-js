## Description

ECommerce API designed based on products with dynamic variations and attributes. This API allows merchants to easily showcase and sell products with diverse specifications.

Build with Nest.js

API Link [https://nest-ecommerce-app.onrender.com/api](https://nest-ecommerce-app.onrender.com/api)

[API Documentation](https://nest-ecommerce-app.onrender.com/api-docs)

## Features:

### Product Variations:

- Enable merchants to create products with multiple variations such as size, color, material, and more.
- Each variation can have its own set of attributes, providing granular control over product details.

### Category Management:

- Categorize products for efficient organization.
- Each product is assigned to a specific category, streamlining navigation for customers.

### Subcategory Support:

- Products may belong to multiple subcategories for refined categorization.
- Subcategories enable more precise navigation and targeted product searches.

### Attribute Management:

- Define and manage a wide range of attributes for each product variation.
- Attributes can include size, color, weight, dimensions, and any other relevant specifications.

### Brands and Attributes:

- Products within a category are associated with specific brands.
- Define attributes unique to each category, enhancing product information.

### Payment Methods

- Facilitate Cash on Delivery as an alternative payment method.
-

### Search and Filtering:

- Implement powerful search and filtering capabilities to help customers easily find products based on specific attributes , categories , product name and brands.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migration

[migration folder](https://github.com/MagedElfar/ecommerce-nest-js/tree/main/src/core/database/migrations)

```bash
# create new migration
$ npx sequelize-cli migration:generate --name file-name

# migrate
$ npx sequelize-cli db:migrate
```

## Environment Variables

Copy this file [.env-sample](https://github.com/MagedElfar/ecommerce-nest-js/blob/main/.env.sample) to .env and replace the placeholder values with your actual configuration.
