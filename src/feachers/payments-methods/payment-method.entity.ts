import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({
    tableName: "payments_methods",
    indexes: [{
        unique: true,
        fields: ["name"]
    }]
})
export class PaymentMethod extends Model<PaymentMethod> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string

}
