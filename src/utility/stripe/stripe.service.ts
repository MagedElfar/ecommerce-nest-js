import { OrdersService } from './../../feachers/orders/orders.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { IOrder } from 'src/feachers/orders/order-interface';
import { OrderStatus, PaymentStatus } from 'src/core/constants';
import { PaymentsService } from 'src/feachers/payments/payments.service';
import { OrdersCancelReasonsService } from 'src/feachers/orders-cancel-reasons/orders-cancel-reasons.service';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private readonly configService: ConfigService,
        private readonly ordersService: OrdersService,
        private readonly ordersCancelReasonsService: OrdersCancelReasonsService,
        private readonly paymentsService: PaymentsService
    ) {
        this.stripe = new Stripe(this.configService.get("stripe.secretKey"))
    }

    async createCheckoutSession(order: IOrder) {
        try {

            const line_items = order.items.map(item => {

                const variant = item.variant
                const price = variant.price || variant.product.price
                const name = variant.name || variant.product.name
                return {
                    quantity: item.quantity,
                    price_data: {
                        currency: "EGP",
                        unit_amount: price * 100,
                        product_data: {
                            name
                        }
                    }
                }
            })

            line_items.push({
                quantity: 1,
                price_data: {
                    currency: "EGP",
                    unit_amount: 15 * 100,
                    product_data: {
                        name: "Shipping Cost"
                    }
                }
            })
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                currency: "EGP",
                client_reference_id: order.orderNumber,
                customer_email: order.user.email,
                success_url: this.configService.get("stripe.successUrl"),
                cancel_url: this.configService.get("stripe.cancelUrl"),
                line_items
            })

            return session
        } catch (error) {
            throw error
        }
    }

    async webhookEvent(req: any) {
        try {
            const sign = req.headers['stripe-signature']

            const rawBody = req.rawBody;

            const event = this.stripe.webhooks.constructEvent(
                rawBody,
                sign,
                this.configService.get("stripe.webhookSecret")
            )


            switch (event.type) {
                case "checkout.session.completed":
                    await this.checkoutSessionCompletedEvent(event)
                    break;
                default:
                    break;
            }

        } catch (error) {
            throw error
        }
    }

    private async checkoutSessionCompletedEvent(event: Stripe.CheckoutSessionCompletedEvent) {
        try {
            const orderNumber = event.data.object.client_reference_id
            const order = await this.ordersService.findOne({
                orderNumber
            });

            if (event.data.object.payment_status === "paid" && order) {
                await this.ordersService.update(order.id, {
                    status: OrderStatus.CONFIRMED
                })

                await this.paymentsService.create({
                    paymentAmount: event.data.object.amount_subtotal,
                    chargeId: event.data.object.payment_intent as string,
                    paymentStatus: PaymentStatus.SUCCUSS,
                    paymentMethodId: 2,
                    orderId: order.id
                })
            }

            if (event.data.object.payment_status === "unpaid" && order) {
                await this.ordersService.update(order.id, {
                    status: OrderStatus.CANCELLED,
                    removeFromStock: true
                })

                await this.paymentsService.create({
                    paymentAmount: event.data.object.amount_subtotal,
                    chargeId: event.data.object.payment_intent as string,
                    paymentStatus: PaymentStatus.FAILED,
                    paymentMethodId: 2,
                    orderId: order.id
                })

                await this.ordersCancelReasonsService.create({
                    reason: 'failed payment',
                    orderId: order.id
                })
            }

        } catch (error) {
            throw error
        }
    }
}
