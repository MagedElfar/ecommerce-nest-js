import { OrdersHelper } from './orders.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderScope } from './entities/order.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateOrderDto } from './dto/create-order.dto';
import { PhonesService } from '../phones/phones.service';
import { AddressesService } from '../addresses/addresses.service';
import { OrdersItemsService } from '../orders-items/orders-items.service';
import { PaymentsMethodsService } from '../payments-methods/payments-methods.service';
import { User } from '../users/user.entity';
import { VariationScope } from '../products-variations/entities/products-variations.entity';
import { OrderStatus } from 'src/core/constants';
import { OrdersQueryDto } from './dto/order-query.dto';
import { Op } from 'sequelize';
import { OrdersCancelReasonsService } from '../orders-cancel-reasons/orders-cancel-reasons.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Transaction } from 'sequelize';
import { StockService } from '../stock/stock.service';
import * as moment from 'moment';
import { ProductVariationsService } from '../products-variations/products-variations.service';
import { IOrder } from './interfaces/order.interface';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order)
        private readonly orderModel: typeof Order,
        private readonly ordersHelper: OrdersHelper,
        private readonly phoneServices: PhonesService,
        private readonly addressesService: AddressesService,
        private readonly paymentsMethodsService: PaymentsMethodsService,
        private readonly ordersItemsService: OrdersItemsService,
        private readonly ordersCancelReasonsService: OrdersCancelReasonsService,
        private readonly productVariationsService: ProductVariationsService,
        private readonly stockService: StockService,
        private readonly sequelize: Sequelize,
    ) { }

    async create(createOrderDto: CreateOrderDto, t?: Transaction): Promise<Order> {
        const transaction = t || await this.sequelize.transaction()
        try {
            const { userId, items: orderItems, phoneAndPhoneId, addressAndAddressId } = createOrderDto;

            const variants = await Promise.all(orderItems.map(async item => {
                const variant = await this.productVariationsService.findOneById(item.variantId, [
                    VariationScope.FOR_ORDER
                ])

                if (!variant) throw new NotFoundException("product not found")

                return variant
            }))

            //1-check quantity availability
            this.stockService.checkSyncQuantity(orderItems, variants)

            //2-calculate order total
            const total = this.ordersHelper.calculateOrderTotal(orderItems, variants);

            console.log("total =", total)

            //3-check if there are phone or create new one if not
            if (createOrderDto.phoneId) {
                const phone = await this.phoneServices.findOne({
                    id: createOrderDto.phoneId,
                    userId
                });
                if (!phone) throw new NotFoundException("user phone not found")
            } else {
                const phone = await this.phoneServices.create({
                    ...createOrderDto.phone,
                    userId
                });

                createOrderDto.phoneId = phone.id
            }

            //4-check if there are address or create new one if not
            if (createOrderDto.addressId) {
                const address = await this.addressesService.findOne({
                    id: createOrderDto.addressId,
                    userId
                });
                if (!address) throw new NotFoundException("user address not found")
            } else {
                const address = await this.addressesService.create({
                    ...createOrderDto.address,
                    userId
                });

                createOrderDto.addressId = address.id
            }

            //5-check payment method
            const paymentMethod = await this.paymentsMethodsService.findOdeById(createOrderDto.paymentMethodId)

            if (!paymentMethod) throw new NotFoundException("paymentMethod not found")

            //6-create order method
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
            const items = await Promise.all(createOrderDto.items.map(async item => {

                //update product quantity
                await this.stockService.removeFromStock(item.variantId, item.quantity, transaction)

                //create order item
                return await this.ordersItemsService.create({
                    quantity: item.quantity,
                    orderId: order["dataValues"].id,
                    variantId: item.variantId
                }, transaction)
            }))

            if (!t) await transaction.commit()

            return await this.findOneById(order.id, Object.values(OrderScope))

        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }

    async findAll(orderQueryDto: OrdersQueryDto): Promise<any> {
        try {

            const { limit, page, userName = "", orderNumber, ...query } = orderQueryDto
            const orders = await this.orderModel.findAndCountAll({
                where: {
                    orderNumber: { [Op.iLike]: `%${orderNumber}%` },
                    ...query
                },
                include: [{
                    model: User,
                    attributes: [],
                    where: {
                        [Op.or]: [
                            { name: { [Op.iLike]: `%${userName}%` } },
                            { lastName: { [Op.iLike]: `%${userName}%` } },
                            { firstName: { [Op.iLike]: `%${userName}%` }, }
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

    async findOne(
        data: Omit<IOrder, "items">,
        scopes: string[] = []
    ): Promise<Order | null> {
        try {
            const order = await this.orderModel.scope(scopes).findOne({ where: data })

            if (!order) return null

            return order["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number, scopes: string[] = []): Promise<Order | null> {
        try {
            const order = await this.orderModel.scope(scopes).findByPk(id)

            if (!order) return null;

            return order["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateOrderDto: UpdateOrderDto) {
        const transaction = await this.sequelize.transaction()

        try {

            const { stockOperation, ...orderDto } = updateOrderDto;

            const order = await this.findOneById(id, [
                OrderScope.WITH_ITEMS
            ])

            if (!order) throw new NotFoundException("Order not found");


            if (orderDto.addToStock || orderDto.removeFromStock) {
                const stock = orderDto.addToStock ? "addToStock" : "removeFromStock";

                await Promise.all(order.items.map(async item => {
                    //update product quantity
                    await this.stockService[stock](item.variantId, item.quantity, transaction)
                }))
            }

            if (orderDto.reason) {
                await this.ordersCancelReasonsService.create({
                    reason: updateOrderDto.reason,
                    orderId: id
                }, transaction)
            }

            if (orderDto.status === OrderStatus.COMPLETED) {
                console.log(moment().format("YYYY-mm-dd HH:mm:ss"))
                updateOrderDto.deliveredAt = moment().toDate()
            }

            await this.orderModel.update(updateOrderDto, {
                where: { id },
                transaction
            })

            await transaction.commit()

            return await this.findOneById(id)
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    // async findOrder(id: number, user?: IUser): Promise<Order> {
    //     try {
    //         const order = await this.findById(id, Object.values(OrderScope))

    //         if (!order) throw new NotFoundException()

    //         if (user && order.userId !== user.id && user.role !== UserRole.ADMIN) throw new ForbiddenException()

    //         return order
    //     } catch (error) {
    //         throw error
    //     }
    // }

}
