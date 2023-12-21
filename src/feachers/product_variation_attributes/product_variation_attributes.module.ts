import { Module } from '@nestjs/common';
import { ProductVariationAttributesController } from './product_variation_attributes.controller';
import { ProductVariationAttributesService } from './product_variation_attributes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVariationAttribute } from './product_variation_attributes.entity';
import { ProductVariationsModule } from '../product-variations/product-variations.module';
import { AttributeValuesModule } from '../attribute-values/attribute-values.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductVariationAttribute]),
    ProductVariationsModule,
    AttributeValuesModule
  ],
  controllers: [ProductVariationAttributesController],
  providers: [ProductVariationAttributesService]
})
export class ProductVariationAttributesModule { }
