import { Module, forwardRef } from '@nestjs/common';
import { ProductsSubCategoriesController } from './products-sub-categories.controller';
import { ProductsSubCategoriesService } from './products-sub-categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductSubCategory } from './entities/products-sub-categories.entity';
import { SubCategoriesModule } from '../sub-categories/sub-categories.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductSubCategory]),
    SubCategoriesModule,
    forwardRef(() => ProductsModule)
  ],
  controllers: [ProductsSubCategoriesController],
  providers: [ProductsSubCategoriesService],
  exports: [ProductsSubCategoriesService]
})
export class ProductsSubCategoriesModule { }
