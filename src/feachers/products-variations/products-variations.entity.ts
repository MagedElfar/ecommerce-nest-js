import { BelongsTo, Column, ForeignKey, Model, Table, DataType, BelongsToMany } from "sequelize-typescript";
import { Product } from "../products/products.entity";
import { AttributeValues } from "../attributes-values/attributes-values.entity";
import { ProductVariationAttribute } from "../products-variations-attributes/products-variations-attributes.entity";

@Table({
    tableName: "products_variations",
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