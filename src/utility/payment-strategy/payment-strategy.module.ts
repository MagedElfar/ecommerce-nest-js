import { Module } from '@nestjs/common';
import { PaymentStrategyService } from './payment-strategy.service';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';
import { CashPaymentStrategy } from './strategies/cash-payment.strategy';
import { StripeModule } from '../stripe/stripe.module';
import { OrdersModule } from 'src/feachers/orders/orders.module';
import { PaymentStrategyFactory } from './payment.factory';

@Module({
  imports: [
    StripeModule,
    OrdersModule
  ],
  providers: [
    PaymentStrategyFactory,
    PaymentStrategyService,
    StripePaymentStrategy,
    CashPaymentStrategy,
  ],
  exports: [PaymentStrategyService]
})
export class PaymentStrategyModule { }
