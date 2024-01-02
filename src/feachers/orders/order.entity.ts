import { Table, Column, Model, DataType, HasOne, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { Address } from '../addresses/address.entity';
import { Phone } from '../phones/phone.entity';
import { User } from '../users/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from '../orders-items/order-item-entity';
import { OrderStatus } from 'src/core/constants';
import { PaymentMethod } from '../payments-methods/payment-method.entity';
import { OrderCancelReason } from '../orders-cancel-reasons/order-cancel-reason.entity';

@Table({
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
    deliveredAt: Date

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

    @HasMany(() => OrderItem)
    items: OrderItem[]

    @HasMany(() => OrderCancelReason)
    cancelReasons: OrderCancelReason[]
}
