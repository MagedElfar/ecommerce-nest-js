import { Table, Column, Model, DataType, HasMany, HasOne, BelongsToMany, BelongsTo, ForeignKey, Scopes, Sequelize } from 'sequelize-typescript';
import { Product } from '../products/products.entity';
import { SubCategory } from '../sub-categories/sub-categories.entity';
import { Brand } from '../brands/brands.entity';
import { AttributeValues } from '../attributes-values/attributes-values.entity';
import { CategoriesAttribute } from '../categories-attributes/categories-attributes.entity';
import { Media } from '../media/media.entity';
import { Attribute } from '../attributes/attribute.entity';

export enum CategoryScope {
    WITH_EMPTY_PRODUCT = "with empty product",
    WITH_IMAGE = "with image",
    WITH_SUB_CATEGORY = "with sub category",
    WITH_BRAND = "with brand",
    WITH_ATTRIBUTES = "with attributes"
}

@Scopes(() => ({
    [CategoryScope.WITH_EMPTY_PRODUCT]: {
        include: [{ model: Product, attributes: [] }]
    },
    [CategoryScope.WITH_IMAGE]: {
        include: [{
            model: Media,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }]
    },
    [CategoryScope.WITH_SUB_CATEGORY]: {
        include: [{
            model: SubCategory,
            attributes: [
                "id",
                "name",
                "slug",
                [
                    Sequelize.literal(
                        '(SELECT COUNT(*) FROM products_sub_categories WHERE products_sub_categories.subCategoryId = SubCategories.id)'
                    ),
                    'totalProducts',
                ],
            ],
            include: [
                {
                    model: Media,
                    attributes: ["id", "url"]
                }
            ]
        }]
    },
    [CategoryScope.WITH_BRAND]: {
        include: [{
            model: Brand,
            attributes: ["id", "name", "slug"],
            include: [{
                model: Media,
                attributes: ["id", "url"]
            }]
        },
        ]
    },

    [CategoryScope.WITH_ATTRIBUTES]: {
        include: [
            {
                model: AttributeValues,
                attributes: ["id", "value"],
                as: 'attributes',
                through: { attributes: [] },
                include: [{ model: Attribute, attributes: ["id", "name"] }]
            }
        ]
    }
}))
@Table({
    indexes: [
        {
            unique: true,
            fields: ['name', 'slug'],
        }
    ],
})
export class Category extends Model<Category> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    slug: string;

    @HasMany(() => SubCategory)
    subCategories: SubCategory[]

    @ForeignKey(() => Media)
    @Column({ allowNull: true })
    imageId: number

    @BelongsTo(() => Media, { onDelete: "SET NULL" })
    image: Media

    @HasMany(() => Product)
    products: Product[]

    @HasMany(() => Brand)
    brands: Brand[]

    @BelongsToMany(() => AttributeValues, () => CategoriesAttribute)
    attributes: AttributeValues[];

    @HasMany(() => CategoriesAttribute)
    categoriesAttribute: CategoriesAttribute[]
}
