import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ProductVariations } from "../../products-variations/entities/products-variations.entity";
import { Order } from "../../orders/entities/order.entity";

@Table({
    tableName: "orders_items"
})
export class OrderItem extends Model<OrderItem> {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    quantity: number

    @ForeignKey(() => Order)
    @Column({
        allowNull: false
    })
    orderId: number

    @BelongsTo(() => Order, { onDelete: "CASCADE" })
    order: Order;

    @ForeignKey(() => ProductVariations)
    @Column({
        allowNull: false
    })
    variantId: number

    @BelongsTo(() => ProductVariations, { onDelete: "CASCADE" })
    variant: ProductVariations;
}