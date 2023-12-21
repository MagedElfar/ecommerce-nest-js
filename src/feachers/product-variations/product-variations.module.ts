import { Module, forwardRef } from '@nestjs/common';
import { ProductVariationsController } from './product-variations.controller';
import { ProductVariationsService } from './product-variations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVariations } from './product-variations.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductVariations]),
    forwardRef(() => ProductsModule)
  ],
  controllers: [ProductVariationsController],
  providers: [ProductVariationsService],
  exports: [ProductVariationsService]
})
export class ProductVariationsModule { }
