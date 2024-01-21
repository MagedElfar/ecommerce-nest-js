import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from './../orders/orders.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { CartItemsService } from '../cart-items/cart-items.service';
import { CartsService } from '../carts/carts.service';
import { PaymentStrategyService } from 'src/utility/payment-strategy/payment-strategy.service';
import { OrderScope } from '../orders/entities/order.entity';
import { CartScop } from '../carts/entities/carts.entity';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly cartsService: CartsService,
        private readonly cartItemService: CartItemsService,
        private readonly paymentStrategyService: PaymentStrategyService,
        private readonly sequelize: Sequelize,
    ) { }

    async checkout(checkoutDto: CheckoutDto) {

        const transaction = await this.sequelize.transaction()


        try {

            //1-get user cart
            const cart = await this.cartsService.findOne({ userId: checkoutDto.userId }, [
                CartScop.WITH_ITEMS
            ]);

            //2-check if cart has items
            if (!cart || cart.items.length <= 0) throw new BadRequestException("cart is empty");

            checkoutDto.items = cart.items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            }))

            //3-create order
            const order = await this.ordersService.create(checkoutDto)

            //11-empty user cart
            await this.cartItemService.deleteCartItems(cart.id, transaction)

            await transaction.commit()

            return await this.paymentStrategyService.processPayment(order.paymentMethod.name, order)
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    async checkoutOrder(orderId: number) {

        try {
            const order = await this.ordersService.findOneById(orderId, [
                OrderScope.WITH_ITEMS,
                OrderScope.WITH_PAYMENT_METHOD
            ])

            return await this.paymentStrategyService.processPayment(order.paymentMethod.name, order);

        } catch (error) {
            throw error
        }
    }
}
