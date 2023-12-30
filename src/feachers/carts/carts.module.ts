import { Module, forwardRef } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './carts.entity';
import { CartItemsModule } from '../cart-items/cart-items.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Cart]),
    forwardRef(() => CartItemsModule)
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule { }
