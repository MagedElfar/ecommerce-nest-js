import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { ProductsImageService } from './products-images.service';
import { ProductImage } from './products-images.entity';
import { ProductsModule } from '../products/products.module';
import { ProductsController } from './products-images.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductImage]),
    ProductsModule,
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsImageService],
})
export class ProductsImageModule { }
