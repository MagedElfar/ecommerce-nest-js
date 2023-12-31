import { Table, Column, Model, DataType, HasMany, HasOne, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Product } from '../products/products.entity';
import { SubCategory } from '../sub-categories/sub-categories.entity';
import { Brand } from '../brands/brands.entity';
import { AttributeValues } from '../attributes-values/attributes-values.entity';
import { CategoriesAttribute } from '../categories-attributes/categories-attributes.entity';
import { Media } from '../media/media.entity';

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
