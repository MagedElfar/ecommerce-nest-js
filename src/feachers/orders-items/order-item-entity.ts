import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Cart } from "../carts/carts.entity";
import { Product } from "../products/products.entity";
import { ProductVariations } from "../products-variations/products-variations.entity";
import { Order } from "../orders/order.entity";

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

    @ForeignKey(() => Product)
    @Column({
        allowNull: false
    })
    productId: number

    @BelongsTo(() => Product, { onDelete: "CASCADE" })
    product: Product;

    @ForeignKey(() => ProductVariations)
    @Column({
        allowNull: false
    })
    variantId: number

    @BelongsTo(() => ProductVariations, { onDelete: "CASCADE" })
    variant: ProductVariations;
}