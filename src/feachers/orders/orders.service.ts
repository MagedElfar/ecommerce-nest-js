import { OrdersHelper } from './orders.helper';
import { CartsService } from './../carts/carts.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './order.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateOrderDto } from './dto/create-order.dto';
import { PhonesService } from '../phones/phones.service';
import { AddressesService } from '../addresses/addresses.service';
import { ProductVariationsService } from '../products-variations/products-variations.service';
import { OrdersItemsService } from '../orders-items/orders-items.service';
import { CartItemsService } from '../cart-items/cart-items.service';
import { PaymentsMethodsService } from '../payments-methods/payments-methods.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order)
        private readonly orderModel: typeof Order,
        private readonly ordersHelper: OrdersHelper,
        private readonly cartsService: CartsService,
        private readonly cartItemService: CartItemsService,
        private readonly phoneServices: PhonesService,
        private readonly addressesService: AddressesService,
        private readonly paymentsMethodsService: PaymentsMethodsService,
        private readonly ordersItemsService: OrdersItemsService,
        private readonly productVariationsService: ProductVariationsService,
        private readonly sequelize: Sequelize,
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        const transaction = await this.sequelize.transaction()
        try {
            const { userId, addressAndAddressId, phoneAndPhoneId } = createOrderDto;

            //1-get user cart
            const cart = await this.cartsService.findOne({ userId });

            //2-check if cart has items
            if (!cart || cart.items.length <= 0) throw new BadRequestException("cart is empty");

            //3-check quantity availability
            this.ordersHelper.quantityAvailability(cart.items);

            //4-calculate order total
            const subTotal = this.ordersHelper.calculateOrderTotal(cart.items);

            //5-check if there are phone or create new one if not
            if (createOrderDto.phoneId) {
                const phone = await this.phoneServices.findOneById(createOrderDto.phoneId);
                if (!phone) throw new NotFoundException("user phone not found")
            } else {
                const phone = await this.phoneServices.create({
                    ...createOrderDto.phone,
                    userId
                });

                createOrderDto.phoneId = phone.id
            }

            //6-check if there are address or create new one if not
            if (createOrderDto.addressId) {
                const address = await this.addressesService.findOneById(createOrderDto.addressId);
                if (!address) throw new NotFoundException("user address not found")
            } else {
                const address = await this.addressesService.create({
                    ...createOrderDto.address,
                    userId
                });

                createOrderDto.addressId = address.id
            }

            //7-check payment method
            const paymentMethod = await this.paymentsMethodsService.findOdeById(createOrderDto.paymentMethodId)

            if (!paymentMethod) throw new NotFoundException("paymentMethod not found")


            //8-create order method
            const order = await this.orderModel.create(
                {
                    userId,
                    subTotal,
                    addressId: createOrderDto.addressId,
                    phoneId: createOrderDto.phoneId,
                    paymentMethodId: createOrderDto.paymentMethodId
                },
                { transaction }
            )

            //10-create order item and update product quantity
            const items = await Promise.all(cart.items.map(async item => {

                //update product quantity
                await this.productVariationsService.update(item.variant.id, {
                    quantity: item.variant.quantity - item.quantity
                }, transaction)

                //create order item
                return await this.ordersItemsService.create({
                    quantity: item.quantity,
                    orderId: order["dataValues"].id,
                    productId: item.product.id,
                    variantId: item.variant.id
                }, transaction)
            }))

            //11-empty user cart
            await this.cartItemService.deleteCartItems(cart.id, transaction)


            await transaction.commit()
            return {
                ...order["dataValues"],
                items,
                paymentMethod
            }

        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
