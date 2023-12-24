import { Module } from '@nestjs/common';
import { SubCategoryImageController } from './sub-category-image.controller';
import { SubCategoryImageService } from './sub-category-image.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubCategoryImage } from './sub-category-image.entity';
import { CategoriesModule } from '../categories/categories.module';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { SubCategoriesModule } from '../sub-categories/sub-categories.module';

@Module({
  imports: [
    SubCategoriesModule,
    SequelizeModule.forFeature([SubCategoryImage]),
    CloudinaryModule,
  ],
  controllers: [SubCategoryImageController],
  providers: [SubCategoryImageService],
  exports: [SubCategoryImageService]
})
export class SubCategoryImageModule { }
