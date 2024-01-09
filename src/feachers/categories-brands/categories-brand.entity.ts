import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { AttributeValues } from '../attributes-values/attributes-values.entity';
import { Category } from '../categories/categories.entity';
import { Brand } from '../brands/brands.entity';

@Table({
    tableName: 'categories_brands',
})
export class CategoryBrand extends Model<CategoryBrand> {

    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id: number;

    @ForeignKey(() => Category)
    @Column
    categoryId: number;

    @BelongsTo(() => Category, { onDelete: "CASCADE" })
    category: Category;

    @ForeignKey(() => Brand)
    @Column
    brandId: number;

    @BelongsTo(() => Brand, { onDelete: "CASCADE" })
    brand: Brand;
} 
