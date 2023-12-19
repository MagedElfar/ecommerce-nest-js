import { Table, Column, Model, DataType, HasMany, HasOne } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { UserImages } from 'src/feachers/users-images/users-images.entity';
import { CategoryImage } from '../category-image/category-image.entity';

@Table({
    indexes: [
        {
            unique: true,
            fields: ['name'],
        },

        {
            unique: true,
            fields: ['slug'],
        },
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

    @HasOne(() => CategoryImage)
    image: CategoryImage

}
