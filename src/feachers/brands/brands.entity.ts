import { Table, Column, Model, DataType, HasMany, HasOne } from 'sequelize-typescript';
import { Product } from '../products/products.entity';
import { BrandImage } from '../brands-images/brands-images.entity';

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

    @HasOne(() => BrandImage)
    image: BrandImage

}
