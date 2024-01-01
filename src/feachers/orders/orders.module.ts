import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.entity';
import { CartsModule } from '../carts/carts.module';
import { OrdersHelper } from './orders.helper';
import { PhonesModule } from '../phones/phones.module';
import { AddressesModule } from '../addresses/addresses.module';
import { ProductVariationsModule } from '../products-variations/products-variations.module';
import { OrdersItemsModule } from '../orders-items/orders-items.module';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { PaymentsMethodsModule } from '../payments-methods/payments-method.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Order]),
    CartsModule,
    PhonesModule,
    AddressesModule,
    PaymentsMethodsModule,
    ProductVariationsModule,
    OrdersItemsModule,
    CartItemsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersHelper]
})
export class OrdersModule { }
