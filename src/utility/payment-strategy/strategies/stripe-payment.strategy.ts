// stripe-payment.strategy.ts
import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './../payment-strategy.interface';
import { IOrder } from 'src/feachers/orders/order-interface';
import { StripeService } from 'src/utility/stripe/stripe.service';

@Injectable()
export class StripePaymentStrategy implements PaymentStrategy {

    constructor(private readonly stripeService: StripeService) { }
    async pay(order: IOrder) {

        try {
            const session = await this.stripeService.createCheckoutSession(order);

            return {
                order,
                sessionUrl: session.url
            }
        } catch (error) {
            error
        }
    }
}