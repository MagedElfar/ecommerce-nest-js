import { BelongsTo, Column, DataType, ForeignKey, Model, Scopes, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";

export enum AddressScope {
    WITH_USER = "with user"
}

@Scopes(() => ({
    [AddressScope.WITH_USER]: {
        include: [{
            model: User,
            attributes: ["id", "name", "email"]
        }]
    }
}))
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