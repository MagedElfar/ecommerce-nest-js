import { ProductVariationsModule } from './../products-variations/products-variations.module';
import { ProductsVariationImageService } from './products-variations-images.service';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { ProductVariationImage } from './products-variations-images.entity';
import { ProductsVariationsImageController } from './products-variations-images.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductVariationImage]),
    ProductVariationsModule,
    CloudinaryModule,
  ],
  controllers: [ProductsVariationsImageController],
  providers: [ProductsVariationImageService],
})
export class ProductsVariationImageModule { }
