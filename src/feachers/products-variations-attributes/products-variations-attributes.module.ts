import { Module, forwardRef } from '@nestjs/common';
import { ProductVariationAttributesController } from './products-variations-attributes.controller';
import { ProductVariationAttributesService } from './products-variations-attributes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVariationAttribute } from './products-variations-attributes.entity';
import { AttributeValuesModule } from '../attributes-values/attributes-values.module';
import { ProductVariationsModule } from '../products-variations/products-variations.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductVariationAttribute]),
    forwardRef(() => ProductVariationsModule),
    AttributeValuesModule
  ],
  controllers: [ProductVariationAttributesController],
  providers: [ProductVariationAttributesService],
  exports: [ProductVariationAttributesService]
})
export class ProductVariationAttributesModule { }
