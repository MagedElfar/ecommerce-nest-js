import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { StripeModule } from 'src/utility/stripe/stripe.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    StripeModule,
    OrdersModule
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService]
})
export class CheckoutModule { }
