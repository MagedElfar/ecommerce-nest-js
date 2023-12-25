import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { ProductVariations } from "../product-variations/product-variations.entity";
import { Category } from "../categories/category.entity";
import { Brand } from "../brands/brands.entity";
import { SubCategory } from "../sub-categories/sub-category.entity";
import { ProductSubCategory } from "../products-sub-categories/products-sub-category.entity";

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

    @BelongsTo(() => Brand, { onDelete: "SET NULL" })
    brand: Brand

    @BelongsToMany(() => SubCategory, {
        through: () => ProductSubCategory,
        onDelete: "CASCADE"
    })
    subCategories?: SubCategory[];
} 