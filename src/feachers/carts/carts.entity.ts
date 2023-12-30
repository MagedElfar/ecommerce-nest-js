import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { CartItem } from "../cart-items/cart-item-entity";

@Table({
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