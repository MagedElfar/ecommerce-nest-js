import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from './../orders/orders.service';
import { StripeService } from './../../utility/stripe/stripe.service';
import { Injectable } from '@nestjs/common';
import { PaymentMethod } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly stripeService: StripeService,
        private readonly ordersService: OrdersService,
        private readonly sequelize: Sequelize,
    ) { }

    async checkout(checkoutDto: CheckoutDto) {

        const transaction = await this.sequelize.transaction()

        try {
            const order = await this.ordersService.create(checkoutDto)

            let session = null

            if (order.paymentMethod.name === PaymentMethod.STRIPE) {
                session = await this.stripeService.createCheckoutSession(order);
            }

            await transaction.commit()

            return { order, session }
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    async checkoutOrder(orderId: number) {

        try {
            const order = await this.ordersService.findById(orderId)

            const session = await this.stripeService.createCheckoutSession(order);

            return session
        } catch (error) {
            throw error
        }
    }
}
