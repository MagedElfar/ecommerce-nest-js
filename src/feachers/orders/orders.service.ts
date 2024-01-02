import { OrdersHelper } from './orders.helper';
import { CartsService } from './../carts/carts.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
import { IOrder } from './order-interface';
import { Address } from '../addresses/address.entity';
import { User } from '../users/user.entity';
import { Phone } from '../phones/phone.entity';
import { OrderItem } from '../orders-items/order-item-entity';
import { ProductVariations } from '../products-variations/products-variations.entity';
import { Product } from '../products/products.entity';
import { IUser } from '../users/users.interface';
import { OrderStatus, UserRole } from 'src/core/constants';
import { PaymentMethod } from '../payments-methods/payment-method.entity';
import { OrdersQueryDto } from './dto/order-query.dto';
import { Op } from 'sequelize';
import { OrderCancelReason } from '../orders-cancel-reasons/order-cancel-reason.entity';
import { OrdersCancelReasonsService } from '../orders-cancel-reasons/orders-cancel-reasons.service';
import { UpdateUserDto } from '../users/dto/updateUserDto.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Transaction } from 'sequelize';
import { Payment } from '../payments/payment.entity';

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
        private readonly ordersCancelReasonsService: OrdersCancelReasonsService,
        private readonly productVariationsService: ProductVariationsService,
        private readonly sequelize: Sequelize,
    ) { }

    async create(createOrderDto: CreateOrderDto, t?: Transaction): Promise<IOrder> {
        const transaction = t || await this.sequelize.transaction()
        try {
            const { userId, addressAndAddressId, phoneAndPhoneId } = createOrderDto;

            //1-get user cart
            const cart = await this.cartsService.findOne({ userId });

            //2-check if cart has items
            if (!cart || cart.items.length <= 0) throw new BadRequestException("cart is empty");

            //3-check quantity availability
            this.ordersHelper.quantityAvailability(cart.items);

            //4-calculate order total
            const total = this.ordersHelper.calculateOrderTotal(cart.items);

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
                    total,
                    subTotal: total,
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


            // //11-empty user cart
            await this.cartItemService.deleteCartItems(cart.id, transaction)


            if (!t) await transaction.commit()
            return await this.findById(order.id)

        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }

    async findAll(orderQueryDto: OrdersQueryDto): Promise<any> {
        try {

            const { limit, page, userName, orderNumber, ...query } = orderQueryDto
            const orders = await this.orderModel.findAndCountAll({
                where: {
                    orderNumber: { [Op.like]: `%${orderNumber}%` },
                    ...query
                },
                include: [{
                    model: User,
                    attributes: [],
                    where: {
                        [Op.or]: [
                            { name: { [Op.like]: `%${userName}%` } },
                            { lastName: { [Op.like]: `%${userName}%` } },
                            { firstName: { [Op.like]: `%${userName}%` }, }
                        ]
                    }
                }],
                limit,
                offset: (page - 1) * limit
            })

            return orders
        } catch (error) {
            throw error
        }
    }

    async findOneByOrderNumber(orderNumber: string): Promise<IOrder> {
        try {

            const orders = await this.orderModel.findOne({ where: { orderNumber } })

            return orders
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IOrder, "phone" | "address" | "items" | "paymentMethod" | "cancelReasons">>, user?: IUser): Promise<IOrder> {
        try {
            const order = await this.orderModel.findOne({
                where: data,
                include: [
                    {
                        model: User,
                        attributes: { exclude: ["updatedAt", "createdAt"] }
                    },
                    {
                        model: Address,
                        attributes: { exclude: ["updatedAt", "createdAt"] }
                    },
                    {
                        model: Phone,
                        attributes: { exclude: ["updatedAt", "createdAt"] }
                    },
                    {
                        model: OrderItem,
                        attributes: { exclude: ["updatedAt", "createdAt"] },
                        include: [
                            {
                                model: ProductVariations,
                                attributes: { exclude: ["updatedAt", "createdAt"] },
                            },
                            {
                                model: Product,
                                attributes: { exclude: ["updatedAt", "createdAt"] },
                            }
                        ]
                    },
                    {
                        model: OrderCancelReason,
                        attributes: { exclude: ["updatedAt", "createdAt"] },
                    },
                    {
                        model: PaymentMethod,
                        attributes: { exclude: ["updatedAt", "createdAt"] }
                    },
                    {
                        model: Payment,
                        attributes: { exclude: ["updatedAt", "createdAt"] }
                    },
                ]
            })

            if (!order) throw new NotFoundException()

            if (user && order.userId !== user.id && user.role !== UserRole.ADMIN) throw new ForbiddenException()

            return order["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findById(id: number): Promise<IOrder | null> {
        try {
            const order = await this.orderModel.findByPk(id, {
                include: [
                    {
                        model: User,
                        attributes: { exclude: ["updatedAt", "createdAt"] },
                    },
                    {
                        model: PaymentMethod,
                        attributes: ["name"]
                    },
                    {
                        model: OrderItem,
                        attributes: { exclude: ["updatedAt", "createdAt"] },
                        include: [
                            {
                                model: ProductVariations,
                                attributes: ["quantity"]
                            },
                            {
                                model: Product,
                                attributes: ["name", "price"]
                            }
                        ]
                    }
                ]
            })

            if (!order) null;

            return order["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateOrderDto: UpdateOrderDto) {
        const transaction = await this.sequelize.transaction()

        try {
            const order = await this.findById(id)

            if (!order) throw new NotFoundException();

            if (updateOrderDto.status === OrderStatus.CANCELLED) {
                if (updateOrderDto.reason)
                    await this.ordersCancelReasonsService.create({
                        reason: updateOrderDto.reason,
                        orderId: id
                    }, transaction)

                if (updateOrderDto.updateStock)
                    await Promise.all(order.items.map(async item => {
                        //update product quantity
                        await this.productVariationsService.update(item.variantId, {
                            quantity: item.variant.quantity + item.quantity
                        }, transaction)
                    }))

            }

            if (updateOrderDto.status === OrderStatus.COMPLETED) {
                // updateOrderDto.deliveredAt = Date.now()
            }

            await this.orderModel.update(updateOrderDto, {
                where: { id },
                transaction
            })

            await transaction.commit()

            return await this.findOne({ id })
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }


}
