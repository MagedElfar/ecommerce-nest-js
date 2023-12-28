import { BelongsTo, Column, DataType, ForeignKey, Model, Table, HasMany, BelongsToMany } from "sequelize-typescript";
import { Attribute } from "../attributes/attribute.entity";
import { ProductVariationAttribute } from "../products-variations-attributes/products-variations-attributes.entity";
import { ProductVariations } from "../products-variations/products-variations.entity";

@Table({
    tableName: "attributes_values"
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


    @BelongsToMany(() => ProductVariations, () => ProductVariationAttribute)
    productVariations: ProductVariations[];
}