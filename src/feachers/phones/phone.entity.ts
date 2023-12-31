import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";

@Table({
    indexes: [{
        unique: true,
        fields: ["phone"]
    }]
})
export class Phone extends Model<Phone> {

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    phone: string

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User, { onDelete: "CASCADE" })
    user: User;

}