import { PaymentStatus } from '../../../core/constants/index';
import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { PaymentMethod } from '../../payments-methods/entities/payment-method.entity';
import { Order } from '../../orders/entities/order.entity';

@Table({
    tableName: "payments_details",
    indexes: [{
        unique: true,
        fields: ["chargeId"]
    }]
})
export class Payment extends Model<Payment> {

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    paymentAmount: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    chargeId: string;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PADDING
    })
    paymentStatus: PaymentStatus

    @ForeignKey(() => PaymentMethod)
    @Column
    paymentMethodId: number

    @BelongsTo(() => PaymentMethod, { onDelete: "SET NULL" })
    paymentMethod: PaymentMethod

    @ForeignKey(() => Order)
    @Column
    orderId: number

    @BelongsTo(() => PaymentMethod, { onDelete: "SET NULL" })
    order: Order
}
