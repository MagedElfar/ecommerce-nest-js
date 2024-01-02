import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrdersModule } from 'src/feachers/orders/orders.module';
import { PaymentsModule } from 'src/feachers/payments/payments.module';
import { OrdersCancelReasonsModule } from 'src/feachers/orders-cancel-reasons/orders-cancel-reasons.module';

@Module({
  imports: [OrdersModule, PaymentsModule, OrdersCancelReasonsModule],
  providers: [StripeService],
  exports: [StripeService],
  controllers: [StripeController]
})
export class StripeModule { }
