import { BelongsTo, Column, DataType, ForeignKey, Model, Table, HasMany, BelongsToMany } from "sequelize-typescript";
import { Attribute } from "../../attributes/entities/attribute.entity";
import { ProductVariationAttribute } from "../../products-variations-attributes/products-variations-attributes.entity";
import { ProductVariations } from "../../products-variations/entities/products-variations.entity";
import { CategoryAttribute } from "../../categories-attributes/entities/categories-attributes.entity";
import { Category } from "../../categories/entities/categories.entity";

@Table({
    tableName: "attributes_values"
})
export class AttributeValue extends Model<AttributeValue>{
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

    @BelongsToMany(() => Category, () => CategoryAttribute)
    categories: Category[];
}