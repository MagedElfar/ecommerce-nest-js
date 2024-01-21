import { Module, forwardRef } from '@nestjs/common';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from './entities/cart-item-entity';
import { CartsModule } from '../carts/carts.module';
import { ProductVariationsModule } from '../products-variations/products-variations.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CartItem]),
    forwardRef(() => CartsModule),
    ProductVariationsModule
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService]
})
export class CartItemsModule { }
