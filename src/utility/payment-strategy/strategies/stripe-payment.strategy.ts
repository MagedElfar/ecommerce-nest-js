// stripe-payment.strategy.ts
import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './../payment-strategy.interface';
import { StripeService } from 'src/utility/stripe/stripe.service';
import { Order } from 'src/feachers/orders/entities/order.entity';
import { IOrder } from 'src/feachers/orders/interfaces/order.interface';

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