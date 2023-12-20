import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";

@Table({
    indexes: [
        {
            unique: true,
            fields: ["name"]
        }
    ]
})
export class Product extends Model<Product> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    slug: string;

    @Column({
        type: DataType.TEXT,
    })
    description: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    price: number

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User, { onDelete: "SET NULL" })
    user: User
}