import { ProductVariationsModule } from './../products-variations/products-variations.module';
import { ProductsVariationImageService } from './products-variations-images.service';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVariationImage } from './products-variations-images.entity';
import { ProductsVariationsImageController } from './products-variations-images.controller';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductVariationImage]),
    ProductVariationsModule,
    MediaModule,
  ],
  controllers: [ProductsVariationsImageController],
  providers: [ProductsVariationImageService],
})
export class ProductsVariationImageModule { }
