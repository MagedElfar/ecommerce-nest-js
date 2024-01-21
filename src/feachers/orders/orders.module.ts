import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { CartsModule } from '../carts/carts.module';
import { OrdersHelper } from './orders.helper';
import { PhonesModule } from '../phones/phones.module';
import { AddressesModule } from '../addresses/addresses.module';
import { ProductVariationsModule } from '../products-variations/products-variations.module';
import { OrdersItemsModule } from '../orders-items/orders-items.module';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { PaymentsMethodsModule } from '../payments-methods/payments-method.module';
import { OrdersCancelReasonsModule } from '../orders-cancel-reasons/orders-cancel-reasons.module';
import { StockModule } from '../stock/stock.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Order]),
    CartsModule,
    PhonesModule,
    AddressesModule,
    PaymentsMethodsModule,
    ProductsModule,
    OrdersItemsModule,
    CartItemsModule,
    OrdersCancelReasonsModule,
    StockModule,
    ProductVariationsModule,
    UsersModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersHelper],
  exports: [OrdersService]
})
export class OrdersModule { }
