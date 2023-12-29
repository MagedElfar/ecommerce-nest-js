import { Table, Column, Model, DataType, HasMany, HasOne, BelongsToMany } from 'sequelize-typescript';
import { Product } from '../products/products.entity';
import { SubCategory } from '../sub-categories/sub-categories.entity';
import { CategoryImage } from '../categories-images/categories-images.entity';
import { Brand } from '../brands/brands.entity';
import { AttributeValues } from '../attributes-values/attributes-values.entity';
import { CategoriesAttribute } from '../categories-attributes/categories-attributes.entity';

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

    @HasOne(() => CategoryImage)
    image: CategoryImage

    @HasMany(() => Product)
    products: Product[]

    @HasMany(() => Brand)
    brands: Brand[]

    @BelongsToMany(() => AttributeValues, () => CategoriesAttribute)
    attributes: AttributeValues[];

    @HasMany(() => CategoriesAttribute)
    categoriesAttribute: CategoriesAttribute[]
}
