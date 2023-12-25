import { BelongsTo, Column, ForeignKey, Model, Table, DataType, BelongsToMany } from "sequelize-typescript";
import { Product } from "../products/product.entity";
import { ProductVariationAttribute } from "../product_variation_attributes/product_variation_attributes.entity";
import { Attribute } from "../attributes/attribute.entity";
import { AttributeValues } from "../attribute-values/attribute-values.entity";

@Table({
    tableName: "product_variations",
    indexes: [
        {
            unique: true,
            fields: ["sku"]
        }
    ]
})
export class ProductVariations extends Model<ProductVariations>{
    @Column({
        type: DataType.STRING
    })
    sku: string

    @Column({
        type: DataType.INTEGER.UNSIGNED
    })
    quantity: number

    @ForeignKey(() => Product)
    @Column
    productId: number

    @BelongsTo(() => Product, { onDelete: "CASCADE" })
    product?: Product

    @BelongsToMany(() => AttributeValues, () => ProductVariationAttribute)
    attributes?: AttributeValues[];

}    