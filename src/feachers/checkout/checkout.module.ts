import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { StripeModule } from 'src/utility/stripe/stripe.module';
import { OrdersModule } from '../orders/orders.module';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { CartsModule } from '../carts/carts.module';
import { PaymentStrategyModule } from 'src/utility/payment-strategy/payment-strategy.module';

@Module({
  imports: [
    StripeModule,
    OrdersModule,
    CartItemsModule,
    CartsModule,
    PaymentStrategyModule
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService]
})
export class CheckoutModule { }
