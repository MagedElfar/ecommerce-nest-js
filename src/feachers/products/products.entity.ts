import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Scopes, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { Category } from "../categories/categories.entity";
import { Brand } from "../brands/brands.entity";
import { SubCategory } from "../sub-categories/sub-categories.entity";
import { ProductSubCategory } from "../products-sub-categories/products-sub-categories.entity";
import { ProductVariations } from "../products-variations/products-variations.entity";
import { CartItem } from "../cart-items/cart-item-entity";
import { Media } from "../media/media.entity";
import { AttributeValues } from "../attributes-values/attributes-values.entity";
import { Attribute } from "../attributes/attribute.entity";

export enum ProductScop {
    WITH_CATEGORY = "with category",
    WITH_MEDIA = "with media",
    WITH_SUB_CATEGORIES = "with sub categories",
    WITH_BRAND = "with brand",
    WITH_VARIATION = "with variation"
}

@Scopes(() => ({
    [ProductScop.WITH_MEDIA]: {
        include: [{
            model: Media,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }]
    },

    [ProductScop.WITH_CATEGORY]: {
        include: [{
            model: Category,
        }]
    },
    [ProductScop.WITH_SUB_CATEGORIES]: {
        include: [{
            model: SubCategory,
            through: { attributes: ["id"] }
        }]
    },
    [ProductScop.WITH_BRAND]: {
        include: [{
            model: Brand,
            attributes: ["id", "name"],
        },]
    },
    [ProductScop.WITH_VARIATION]: {
        include: [{
            model: ProductVariations,
            include: [
                {
                    model: Media,
                    attributes: ["id", "url"],
                    through: { attributes: ["id"] }
                },
                {
                    model: AttributeValues,
                    attributes: ["value", "id"],
                    through: { attributes: ["id"] },
                    include: [
                        {
                            model: Attribute,
                            attributes: ["id", "name"],

                        }
                    ]
                }
            ]
        }]
    }
}))
@Table({
    indexes: [
        {

            unique: true,
            fields: ["name"]
        }
    ]
})
export class Product extends Model<Product> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    slug: string;

    @Column({
        type: DataType.TEXT,
    })
    description: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    price: number

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User, { onDelete: "SET NULL", })
    user: User

    @HasMany(() => ProductVariations, { as: "variations" })
    variations: ProductVariations[]

    @ForeignKey(() => Category)
    categoryId: number

    @BelongsTo(() => Category, { onDelete: "SET NULL", })
    category: Category

    @ForeignKey(() => Brand)
    brandId: number

    @ForeignKey(() => Media)
    @Column({ allowNull: true })
    imageId: number

    @BelongsTo(() => Media, { onDelete: "SET NULL" })
    image: Media

    @BelongsTo(() => Brand, { onDelete: "SET NULL" })
    brand: Brand

    @BelongsToMany(() => SubCategory, {
        through: () => ProductSubCategory,
        onDelete: "CASCADE"
    })
    subCategories?: SubCategory[];
} 