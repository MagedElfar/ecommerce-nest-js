import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { UserImages } from 'src/users-images/users-images.entity';

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

}
