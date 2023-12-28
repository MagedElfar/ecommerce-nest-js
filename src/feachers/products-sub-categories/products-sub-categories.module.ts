import { Module } from '@nestjs/common';
import { ProductsSubCategoriesController } from './products-sub-categories.controller';
import { ProductsSubCategoriesService } from './products-sub-categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductSubCategory } from './products-sub-categories.entity';

@Module({
  imports: [SequelizeModule.forFeature([ProductSubCategory])],
  controllers: [ProductsSubCategoriesController],
  providers: [ProductsSubCategoriesService],
  exports: [ProductsSubCategoriesService]
})
export class ProductsSubCategoriesModule { }
