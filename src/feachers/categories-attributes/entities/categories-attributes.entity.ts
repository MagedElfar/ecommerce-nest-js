import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { AttributeValue } from '../../attributes-values/entities/attribute-value.entity';
import { Category } from '../../categories/entities/categories.entity';

@Table({
    tableName: 'categories_attributes',
})
export class CategoryAttribute extends Model<CategoryAttribute> {

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

    @ForeignKey(() => AttributeValue)
    @Column
    attributeId: number;

    @BelongsTo(() => AttributeValue, { onDelete: "CASCADE" })
    attribute: AttributeValue;


} 
