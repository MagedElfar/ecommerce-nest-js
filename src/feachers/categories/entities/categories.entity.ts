import { Table, Column, Model, DataType, HasMany, HasOne, BelongsToMany, BelongsTo, ForeignKey, Scopes, Sequelize } from 'sequelize-typescript';
import { Product } from '../../products/entities/products.entity';
import { SubCategory } from '../../sub-categories/enities/sub-categories.entity';
import { Brand } from '../../brands/entities/brands.entity';
import { AttributeValue } from '../../attributes-values/entities/attribute-value.entity';
import { CategoryAttribute } from '../../categories-attributes/entities/categories-attributes.entity';
import { Media } from '../../media/entities/media.entity';
import { Attribute } from '../../attributes/entities/attribute.entity';
import { CategoryBrand } from '../../categories-brands/entities/categories-brand.entity';

export enum CategoryScope {
    WITH_EMPTY_PRODUCT = "with empty product",
    WITH_IMAGE = "with image",
    WITH_SUB_CATEGORY = "with sub category",
    WITH_BRAND = "with brand",
    WITH_ATTRIBUTES = "with attributes",
    WITH_GROUP = "with group"
}

@Scopes(() => ({
    [CategoryScope.WITH_EMPTY_PRODUCT]: {
        include: [{ model: Product, attributes: [] }]
    },
    [CategoryScope.WITH_IMAGE]: {
        include: [{
            model: Media,
            attributes: ["id", "url"]
        }]
    },
    [CategoryScope.WITH_SUB_CATEGORY]: {
        include: [{
            model: SubCategory,
            attributes: [
                "id",
                "name",
                "slug",

                process.env.DB_DIALECT === "mysql" ?
                    [
                        Sequelize.literal(
                            '(SELECT COUNT(*) FROM products_sub_categories WHERE products_sub_categories.subCategoryId = subCategories.id)'
                        ),
                        'totalProducts',
                    ]
                    :
                    [
                        Sequelize.literal(
                            '(SELECT COUNT(*) FROM  "public"."products_sub_categories" WHERE  "public"."products_sub_categories"."subCategoryId" = "subCategories"."id")'
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
            through: { attributes: ["id"] },
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
                model: AttributeValue,
                attributes: ["id", "value"],
                as: 'attributes',
                through: { attributes: ["id"] },
                include: [{ model: Attribute, attributes: ["id", "name"] }]
            }
        ]
    },
    [CategoryScope.WITH_GROUP]: {
        attributes: {
            include: [
                [
                    Sequelize.fn('COUNT', Sequelize.col('products.id')),
                    'totalProducts'
                ]
            ]
        },
        subQuery: false,
        group: ['Category.id', "image.id", "subCategories.id", "subCategories->image.id", "brands.id", "brands->CategoryBrand.id", "attributes->CategoryAttribute.id", "brands->image.id", "attributes.id", "attributes->attribute.id"]

    }
}))
@Table({
    tableName: "categories",
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

    @BelongsToMany(() => AttributeValue, () => CategoryAttribute)
    attributes: AttributeValue[];

    @BelongsToMany(() => Brand, () => CategoryBrand)
    brands: Brand[];

    @HasMany(() => CategoryAttribute)
    categoriesAttribute: CategoryAttribute[]
}
