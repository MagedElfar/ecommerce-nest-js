import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from '../categories/categories.module';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { ProductsImageService } from './products-variations-images.service';
import { ProductImage } from './products-variations-images.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductImage]),
    ProductsModule,
    CloudinaryModule,
  ],
  providers: [ProductsImageService],
})
export class ProductsImageModule { }
