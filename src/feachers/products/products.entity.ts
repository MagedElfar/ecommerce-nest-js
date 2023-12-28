import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "../users/user.entity";
import { Category } from "../categories/categories.entity";
import { Brand } from "../brands/brands.entity";
import { SubCategory } from "../sub-categories/sub-categories.entity";
import { ProductSubCategory } from "../products-sub-categories/products-sub-categories.entity";
import { ProductVariations } from "../products-variations/products-variations.entity";
import { ProductImage } from "../products-images/products-images.entity";

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

    @HasOne(() => ProductImage)
    image: ProductImage

    @BelongsTo(() => Brand, { onDelete: "SET NULL" })
    brand: Brand

    @BelongsToMany(() => SubCategory, {
        through: () => ProductSubCategory,
        onDelete: "CASCADE"
    })
    subCategories?: SubCategory[];
} 