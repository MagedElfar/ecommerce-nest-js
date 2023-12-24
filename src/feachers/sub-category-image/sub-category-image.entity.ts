import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/feachers/users/user.entity';
import { Category } from '../categories/category.entity';
import { SubCategory } from '../sub-categories/sub-category.entity';

@Table({ tableName: "sub_category_image" })
export class SubCategoryImage extends Model<SubCategoryImage> {
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

    @ForeignKey(() => SubCategory)
    @Column
    subCategoryId: number;

    @BelongsTo(() => SubCategory, { onDelete: "CASCADE" }) // Specify onDelete option here
    subCategory: SubCategory;

}
