import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { AttributeValues } from "../attributes-values/attributes-values.entity";

@Table({
    indexes: [
        {
            unique: true,
            fields: ["name"]
        }
    ]
})
export class Attribute extends Model<Attribute> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @HasMany(() => AttributeValues)
    values: AttributeValues[]
}