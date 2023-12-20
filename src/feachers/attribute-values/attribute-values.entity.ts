import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Attribute } from "../attributes/attribute.entity";

@Table({
    tableName: "attribute_values"
})
export class AttributeValues extends Model<AttributeValues>{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    value: string;

    @ForeignKey(() => Attribute)
    @Column({ allowNull: false })
    attributeId: number

    @BelongsTo(() => Attribute, { onDelete: "CASCADE" })
    attribute: Attribute
}