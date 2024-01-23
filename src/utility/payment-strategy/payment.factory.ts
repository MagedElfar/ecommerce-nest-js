import { StripeService } from 'src/utility/stripe/stripe.service';
import { OrdersService } from 'src/feachers/orders/orders.service';
import { PaymentStrategy } from "./payment-strategy.interface";
import { CashPaymentStrategy } from "./strategies/cash-payment.strategy";
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';
import { Injectable } from '@nestjs/common';

interface IPaymentFactory {
    create(method: string): PaymentStrategy
}

@Injectable()
export class PaymentStrategyFactory implements IPaymentFactory {

    constructor(
        private readonly ordersService: OrdersService,
        private readonly stripeService: StripeService
    ) { }

    create(method: string): PaymentStrategy {

        switch (method) {
            case "cash on delivery":
                return new CashPaymentStrategy(this.ordersService);

            case "stripe":
                return new StripePaymentStrategy(this.stripeService);

            default:
                throw new Error("Method not implemented.");
        }
    }

}