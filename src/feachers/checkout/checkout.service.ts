import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from './../orders/orders.service';
import { StripeService } from './../../utility/stripe/stripe.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentMethod } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { CartItemsService } from '../cart-items/cart-items.service';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly stripeService: StripeService,
        private readonly ordersService: OrdersService,
        private readonly cartsService: CartsService,
        private readonly cartItemService: CartItemsService,
        private readonly sequelize: Sequelize,
    ) { }

    async checkout(checkoutDto: CheckoutDto) {

        const transaction = await this.sequelize.transaction()

        try {

            //1-get user cart
            const cart = await this.cartsService.findOne({ userId: checkoutDto.userId });

            //2-check if cart has items
            if (!cart || cart.items.length <= 0) throw new BadRequestException("cart is empty");

            checkoutDto.items = cart.items.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity
            }))

            //3-create order
            const order = await this.ordersService.create(checkoutDto)

            //11-empty user cart
            await this.cartItemService.deleteCartItems(cart.id, transaction)

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
