import { BelongsTo, Column, DataType, ForeignKey, Model, Scopes, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";

export enum PhoneScope {
    WITH_USER = "with user"
}

@Scopes(() => ({
    [PhoneScope.WITH_USER]: {
        include: [{
            model: User,
            attributes: ["id", "name", "email"]
        }]
    }
}))
@Table({
    tableName: "phones",
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