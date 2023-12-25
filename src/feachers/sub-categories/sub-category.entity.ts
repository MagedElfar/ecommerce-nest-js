import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Category } from '../categories/category.entity';
import { SubCategoryImage } from '../sub-category-image/sub-category-image.entity';
import { ProductSubCategory } from '../products-sub-categories/products-sub-category.entity';
import { Product } from '../products/product.entity';


@Table({
    tableName: "seb_categories",
    indexes: [
        {
            unique: true,
            fields: ['name', 'slug'],
        }
    ],
})
export class SubCategory extends Model<SubCategory> {
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

    @ForeignKey(() => Category)
    @Column
    categoryId: number

    @BelongsTo(() => Category, { onDelete: "SET NULL" })
    category: Category

    @HasOne(() => SubCategoryImage)
    image: SubCategoryImage

    @BelongsToMany(() => Product, () => ProductSubCategory)
    products?: Product[];


}
