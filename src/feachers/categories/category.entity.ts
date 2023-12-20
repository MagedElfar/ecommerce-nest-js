import { Table, Column, Model, DataType, HasMany, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserRole } from 'src/core/constants';
import { UserImages } from 'src/feachers/users-images/users-images.entity';
import { CategoryImage } from '../category-image/category-image.entity';

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

    @ForeignKey(() => Category)
    @Column
    parentId: number

    @BelongsTo(() => Category, { onDelete: "SET NULL", as: "parent" })
    parent: Category

    @HasMany(() => Category, { as: "subCategories" })
    subCategories: Category[]

    @HasOne(() => CategoryImage)
    image: CategoryImage

}