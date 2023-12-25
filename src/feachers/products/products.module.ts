import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { ProductVariationsModule } from '../product-variations/product-variations.module';
import { ProductsSubCategoriesModule } from '../products-sub-categories/products-sub-categories.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => ProductVariationsModule),
    ProductsSubCategoriesModule
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule { }
