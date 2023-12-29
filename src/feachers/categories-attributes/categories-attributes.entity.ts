import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { AttributeValues } from '../attributes-values/attributes-values.entity';
import { Category } from '../categories/categories.entity';

@Table({
    tableName: 'categories_attributes',
})
export class CategoriesAttribute extends Model<CategoriesAttribute> {

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

    @ForeignKey(() => AttributeValues)
    @Column
    attributeId: number;

    @BelongsTo(() => AttributeValues, { onDelete: "CASCADE" })
    attribute: AttributeValues;


} 
