import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Order } from "../../orders/entities/order.entity";

@Table({
    tableName: "order_cancel_reason"
})
export class OrderCancelReason extends Model<OrderCancelReason> {

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    reason: string

    @ForeignKey(() => Order)
    @Column
    orderId: number

    @BelongsTo(() => Order, { onDelete: "CASCADE" })
    order: Order;

}