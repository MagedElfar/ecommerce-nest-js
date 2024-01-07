import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo, Scopes } from 'sequelize-typescript';
import { Product } from '../products/products.entity';
import { Category } from '../categories/categories.entity';
import { Media } from '../media/media.entity';

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

    @ForeignKey(() => Category)
    @Column({ allowNull: true })
    categoryId: number

    @BelongsTo(() => Category, { onDelete: "SET NULL" })
    category: Category

    @HasMany(() => Product)
    products: Product[]

    @ForeignKey(() => Media)
    @Column({ allowNull: true })
    imageId: number

    @BelongsTo(() => Media, { onDelete: "SET NULL" })
    image: Media
}
