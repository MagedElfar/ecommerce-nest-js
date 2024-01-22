import { BelongsTo, Column, DataType, ForeignKey, Model, Scopes, Table } from "sequelize-typescript";
import { Cart } from "../../carts/entities/carts.entity";
import { Product } from "../../products/entities/products.entity";
import { ProductVariations } from "../../products-variations/entities/products-variations.entity";
import { Media } from "../../media/entities/media.entity";

export enum CartItemScope {
    WITH_CART = "with cart",
    WITH_PRODUCT = "with product"
}

@Scopes(() => ({
    [CartItemScope.WITH_CART]: {
        include: Cart
    },
    [CartItemScope.WITH_PRODUCT]: {
        include: [{
            model: ProductVariations,
            include: [
                {
                    model: Media,
                    attributes: ["id", "url"]
                },
                {
                    model: Product,
                    attributes: ["id", "price", "name"]
                }
            ]
        }]
    }
}))
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

    @ForeignKey(() => ProductVariations)
    @Column({
        allowNull: false
    })
    variantId: number

    @BelongsTo(() => ProductVariations, { onDelete: "CASCADE" })
    variant: ProductVariations;
}