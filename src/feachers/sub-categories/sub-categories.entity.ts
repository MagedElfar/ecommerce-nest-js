import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, BelongsToMany, Scopes } from 'sequelize-typescript';
import { Category } from '../categories/categories.entity';
import { ProductSubCategory } from '../products-sub-categories/products-sub-categories.entity';
import { Product } from '../products/products.entity';
import { Media } from '../media/media.entity';

export enum SubCategoryScope {
    WITH_IMAGE = "with image"
}

@Scopes(() => ({
    [SubCategoryScope.WITH_IMAGE]: {
        include: [{
            model: Media
        }]
    }
}))
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

    @ForeignKey(() => Media)
    @Column({ allowNull: true })
    imageId: number

    @BelongsTo(() => Media, { onDelete: "SET NULL" })
    image: Media

    @BelongsToMany(() => Product, () => ProductSubCategory)
    products?: Product[];

}
