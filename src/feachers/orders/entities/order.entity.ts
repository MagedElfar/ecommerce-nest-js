import { Table, Column, Model, DataType, HasOne, BelongsTo, ForeignKey, HasMany, Scopes } from 'sequelize-typescript';
import { Address } from '../../addresses/entities/address.entity';
import { Phone } from '../../phones/entities/phone.entity';
import { User } from '../../users/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from '../../orders-items/entities/order-item-entity';
import { OrderStatus } from 'src/core/constants';
import { PaymentMethod } from '../../payments-methods/entities/payment-method.entity';
import { OrderCancelReason } from '../../orders-cancel-reasons/entities/order-cancel-reason.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { ProductVariations } from '../../products-variations/entities/products-variations.entity';
import { Product } from '../../products/entities/products.entity';

export enum OrderScope {
    WITH_USER = "with user",
    WITH_ADDRESS = "with address",
    WITH_ITEMS = "with items",
    WITH_CANCEL = "with cancel",
    WITH_PAYMENT_METHOD = "with payment method",
    WITH_PAYMENT = "with payment"
}

@Scopes(() => ({
    [OrderScope.WITH_USER]: {
        include: [{
            model: User,
            attributes: { exclude: ["updatedAt", "createdAt"] },
        }]
    },
    [OrderScope.WITH_ADDRESS]: {
        include: [{
            model: Address,
            attributes: { exclude: ["updatedAt", "createdAt"] }
        },]
    },
    [OrderScope.WITH_ITEMS]: {
        include: [{
            model: OrderItem,
            attributes: { exclude: ["updatedAt", "createdAt"] },
            include: [
                {
                    model: ProductVariations,
                    attributes: { exclude: ["updatedAt", "createdAt"] },
                    include: [{
                        model: Product,
                        attributes: ["id", "name", "price"]
                    }]
                },
            ]
        },]
    },
    [OrderScope.WITH_CANCEL]: {
        include: [{
            model: OrderCancelReason,
            attributes: { exclude: ["updatedAt", "createdAt"] },
        }]
    },
    [OrderScope.WITH_PAYMENT_METHOD]: {
        include: [{
            model: PaymentMethod,
            attributes: { exclude: ["updatedAt", "createdAt"] }
        },]
    },
    [OrderScope.WITH_PAYMENT]: {
        include: [{
            model: Payment,
            attributes: { exclude: ["updatedAt", "createdAt"] }
        }]
    },
}))
@Table({
    tableName: "orders",
    indexes: [{
        unique: true,
        fields: ["orderNumber"]
    }]
})
export class Order extends Model<Order> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: uuidv4()
    })
    orderNumber: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    total: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    subTotal: number;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    deliveredAt: string

    @Column({
        allowNull: false,
        type: DataType.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PADDING
    })
    status: OrderStatus

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User, { onDelete: "SET NULL" })
    user: User

    @ForeignKey(() => Address)
    @Column
    addressId: number

    @BelongsTo(() => Address, { onDelete: "SET NULL" })
    address: Address

    @ForeignKey(() => Phone)
    @Column
    phoneId: number

    @BelongsTo(() => Phone, { onDelete: "SET NULL" })
    phone: Phone

    @ForeignKey(() => PaymentMethod)
    @Column
    paymentMethodId: number

    @BelongsTo(() => PaymentMethod, { onDelete: "SET NULL" })
    paymentMethod: PaymentMethod

    @HasOne(() => Payment)
    payment: Payment

    @HasMany(() => OrderItem)
    items: OrderItem[]

    @HasMany(() => OrderCancelReason)
    cancelReasons: OrderCancelReason[]
}
