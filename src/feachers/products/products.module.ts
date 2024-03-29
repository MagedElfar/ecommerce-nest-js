import { ProductsImageController } from './controllers/products-images.controller';
import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/products.entity';
import { ProductsSubCategoriesModule } from '../products-sub-categories/products-sub-categories.module';
import { ProductVariationsModule } from '../products-variations/products-variations.module';
import { ProductsImageService } from './services/products-images.service';
import { MediaModule } from '../media/media.module';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';
import { SubCategoriesModule } from '../sub-categories/sub-categories.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => ProductVariationsModule),
    forwardRef(() => ProductsSubCategoriesModule),
    MediaModule,
    CategoriesModule,
    BrandsModule,
    SubCategoriesModule
  ],
  providers: [ProductsService, ProductsImageService],
  controllers: [ProductsController, ProductsImageController],
  exports: [ProductsService]
})
export class ProductsModule { }
