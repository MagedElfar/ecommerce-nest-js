import { Module, forwardRef } from '@nestjs/common';
import { CategoryImageController } from './categories-images.controller';
import { CategoryImageService } from './categories-images.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryImage } from './categories-images.entity';
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
