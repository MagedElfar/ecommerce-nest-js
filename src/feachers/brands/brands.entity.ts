import { Table, Column, Model, DataType, HasMany, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { UserImages } from 'src/feachers/users-images/users-images.entity';
import { CategoryImage } from '../category-image/category-image.entity';
import { BrandImage } from '../brands-image/brands-image.entity';

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

    @HasOne(() => BrandImage)
    image: BrandImage

}
