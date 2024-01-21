import { BelongsTo, Column, ForeignKey, Model, Table, DataType, BelongsToMany, HasMany, Scopes } from "sequelize-typescript";
import { Product } from "../../products/entities/products.entity";
import { AttributeValue } from "../../attributes-values/entities/attribute-value.entity";
import { ProductVariationAttribute } from "../../products-variations-attributes/products-variations-attributes.entity";
// import { ProductVariationImage } from "../products-variations-images/products-variations-images.entity";
import { CartItem } from "../../cart-items/entities/cart-item-entity";
import { Media } from "../../media/entities/media.entity";
import { ProductVariationImage } from "../../products-variations-images/products-variations-images.entity";

export enum VariationScope {
    WITH_MEDIA = "with media",
    WITH_PRODUCT = "with product",
    WITH_ATTRIBUTES = "with attributes",
    WITH_PRODUCT_MAIN_INFO = "with product main info",
    FOR_ORDER = "for order"
}

@Scopes(() => ({
    [VariationScope.WITH_MEDIA]: {
        include: [{
            model: Media,
            through: { attributes: ["id"] }
        }]
    },
    [VariationScope.WITH_PRODUCT]: {
        include: [{
            model: Product,
            include: [{
                model: Media
            }]
        }]
    },
    [VariationScope.WITH_PRODUCT_MAIN_INFO]: {
        include: [{
            model: Product,
            attributes: ["id", "price", "name"],
            include: [{
                model: Media,
                attributes: ["url"]
            }]
        }]
    },
    [VariationScope.FOR_ORDER]: {
        include: [{
            model: Product,
            attributes: ["id", "price", "name"]
        }]
    },
    [VariationScope.WITH_ATTRIBUTES]: {
        include: [{
            model: AttributeValue,
            through: { attributes: ["id"] }
        }]
    }
}))
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
    name: string

    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    price: number

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

    @BelongsToMany(() => Media, () => ProductVariationImage)
    images?: ProductVariationImage[];

    @BelongsTo(() => Product, { onDelete: "CASCADE" })
    product?: Product

    @BelongsToMany(() => AttributeValue, () => ProductVariationAttribute)
    attributes?: AttributeValue[];

    @HasMany(() => CartItem)
    items: CartItem[]

}     