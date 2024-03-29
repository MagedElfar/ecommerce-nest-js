import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from "sequelize-typescript";
import { User } from "../../users/user.entity";
import { CartItem } from "../../cart-items/entities/cart-item-entity";
import { Media } from "../../media/entities/media.entity";
import { ProductVariations } from "../../products-variations/entities/products-variations.entity";
import { Product } from "../../products/entities/products.entity";

export enum CartScop {
    WITH_ITEMS = "with items"
}

@Scopes(() => ({
    [CartScop.WITH_ITEMS]: {
        include: [{
            model: CartItem,
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
        }]
    }
}))
@Table({
    tableName: "carts",
    indexes: [
        {
            unique: true,
            fields: ["userId"]
        }
    ]
})
export class Cart extends Model<Cart> {

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User, { onDelete: "CASCADE" })
    user: User;

    @HasMany(() => CartItem)
    items: CartItem[]
}