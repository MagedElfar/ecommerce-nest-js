import { CloudinaryModule } from './../../utility/cloudinary/cloudinary.module';
import { Module, forwardRef } from '@nestjs/common';
import { ProductVariationsController } from './products-variations.controller';
import { ProductVariationsService } from './products-variations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVariations } from './entities/products-variations.entity';
import { ProductsModule } from '../products/products.module';
import { ProductVariationAttributesModule } from '../products-variations-attributes/products-variations-attributes.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductVariations]),
    forwardRef(() => ProductsModule),
    forwardRef(() => ProductVariationAttributesModule),
    MediaModule
  ],
  controllers: [ProductVariationsController],
  providers: [ProductVariationsService],
  exports: [ProductVariationsService]
})
export class ProductVariationsModule { }
