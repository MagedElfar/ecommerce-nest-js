import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './products.entity';
import { ProductsSubCategoriesModule } from '../products-sub-categories/products-sub-categories.module';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { ProductVariationsModule } from '../products-variations/products-variations.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => ProductVariationsModule),
    ProductsSubCategoriesModule,
    CloudinaryModule
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule { }
