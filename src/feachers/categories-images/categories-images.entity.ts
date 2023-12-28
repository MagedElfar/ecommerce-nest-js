import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from '../categories/categories.entity';

@Table({ tableName: "categories_images" })
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
