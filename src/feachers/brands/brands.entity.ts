import { Category } from 'src/feachers/categories/categories.entity';
import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo, Scopes, BelongsToMany } from 'sequelize-typescript';
import { Product } from '../products/products.entity';
import { Media } from '../media/media.entity';
import { CategoryBrand } from '../categories-brands/categories-brand.entity';

export enum BrandScope {
    WITH_IMAGE = "with imaged"
}

@Scopes(() => ({
    [BrandScope.WITH_IMAGE]: {
        include: [{
            model: Media,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }]
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
export class Brand extends Model<Brand> {
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

    @HasMany(() => Product)
    products: Product[]

    @ForeignKey(() => Media)
    @Column({ allowNull: true })
    imageId: number

    @BelongsTo(() => Media, { onDelete: "SET NULL" })
    image: Media

    @BelongsToMany(() => Category, () => CategoryBrand)
    categories: Category[];
}
