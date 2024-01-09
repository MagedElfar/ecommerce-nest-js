import { Module } from '@nestjs/common';
import { CategoriesBrandsController } from './categories-brands.controller';
import { CategoriesBrandsService } from './categories-brands.service';
import { CategoryBrand } from './categories-brand.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CategoryBrand]),
    CategoriesModule,
    BrandsModule
  ],
  controllers: [CategoriesBrandsController],
  providers: [CategoriesBrandsService]
})
export class CategoriesBrandsModule { }
