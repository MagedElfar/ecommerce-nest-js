import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/feachers/users/user.entity';
import { Category } from '../categories/category.entity';

@Table({ tableName: "category_image" })
export class CategoryImage extends Model<CategoryImage> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    storageKey: string

    @ForeignKey(() => Category)
    @Column
    categoryId: number;

    @BelongsTo(() => Category, { onDelete: "CASCADE" })
    category: Category;

}
