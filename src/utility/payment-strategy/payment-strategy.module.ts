import { Module } from '@nestjs/common';
import { PaymentStrategyService } from './payment-strategy.service';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';
import { CashPaymentStrategy } from './strategies/cash-payment.strategy';
import { StripeModule } from '../stripe/stripe.module';
import { OrdersModule } from 'src/feachers/orders/orders.module';

@Module({
  imports: [
    StripeModule,
    OrdersModule
  ],
  providers: [
    PaymentStrategyService,
    StripePaymentStrategy,
    CashPaymentStrategy,
    {
      provide: 'PaymentStrategy',
      useFactory: (stripeStrategy: StripePaymentStrategy, cashStrategy: CashPaymentStrategy) => {
        return {
          stripe: stripeStrategy,
          ["cash on delivery"]: cashStrategy,
          // Add other strategies here
        };
      },
      inject: [StripePaymentStrategy, CashPaymentStrategy],
    },
  ],
  exports: [PaymentStrategyService]
})
export class PaymentStrategyModule { }
