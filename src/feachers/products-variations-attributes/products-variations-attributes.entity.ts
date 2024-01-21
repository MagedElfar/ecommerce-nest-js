import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { AttributeValue } from '../attributes-values/entities/attribute-value.entity';
import { ProductVariations } from '../products-variations/entities/products-variations.entity';

@Table({
    tableName: 'products_variations_attributes',
})
export class ProductVariationAttribute extends Model<ProductVariationAttribute> {

    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id: number;

    @ForeignKey(() => ProductVariations)
    @Column
    productVariationId: number;

    @BelongsTo(() => ProductVariations, { onDelete: "CASCADE" })
    proVar: ProductVariations;

    @ForeignKey(() => AttributeValue)
    @Column
    attrId: number;

    @BelongsTo(() => AttributeValue, { onDelete: "CASCADE" })
    attribute: AttributeValue;


} 
