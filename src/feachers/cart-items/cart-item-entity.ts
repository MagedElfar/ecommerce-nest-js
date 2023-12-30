import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Cart } from "../carts/carts.entity";
import { Product } from "../products/products.entity";
import { ProductVariations } from "../products-variations/products-variations.entity";

@Table({
    tableName: "carts_items"
})
export class CartItem extends Model<CartItem> {

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1
    })
    total: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    quantity: number

    @ForeignKey(() => Cart)
    @Column({
        allowNull: false
    })
    cartId: number

    @BelongsTo(() => Cart, { onDelete: "CASCADE" })
    cart: Cart;

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