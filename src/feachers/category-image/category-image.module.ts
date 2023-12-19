import { Module, forwardRef } from '@nestjs/common';
import { CategoryImageController } from './category-image.controller';
import { CategoryImageService } from './category-image.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryImage } from './category-image.entity';
import { CategoriesModule } from '../categories/categories.module';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';

@Module({
  imports: [
    CategoriesModule,
    SequelizeModule.forFeature([CategoryImage]),
    CloudinaryModule,
  ],
  controllers: [CategoryImageController],
  providers: [CategoryImageService],
  exports: [CategoryImageService]
})
export class CategoryImageModule { }
