import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { CartItem } from "../cart-items/cart-item-entity";

@Table
export class Address extends Model<Address> {

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    country: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    city: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    street: string

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    addressLine: string

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User, { onDelete: "CASCADE" })
    user: User;

}