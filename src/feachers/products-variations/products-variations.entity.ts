import { BelongsTo, Column, ForeignKey, Model, Table, DataType, BelongsToMany, HasMany } from "sequelize-typescript";
import { Product } from "../products/products.entity";
import { AttributeValues } from "../attributes-values/attributes-values.entity";
import { ProductVariationAttribute } from "../products-variations-attributes/products-variations-attributes.entity";
import { ProductVariationImage } from "../products-variations-images/products-variations-images.entity";
import { CartItem } from "../cart-items/cart-item-entity";

@Table({
    tableName: "products_variations",
    indexes: [
        {
            unique: true,
            fields: ["sku", "name"]
        }
    ]
})
export class ProductVariations extends Model<ProductVariations>{
    @Column({
        type: DataType.STRING
    })
    name: string

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

    @HasMany(() => ProductVariationImage)
    images: ProductVariationImage[]

    @BelongsTo(() => Product, { onDelete: "CASCADE" })
    product?: Product

    @BelongsToMany(() => AttributeValues, () => ProductVariationAttribute)
    attributes?: AttributeValues[];

    @HasMany(() => CartItem)
    items: CartItem[]

}    