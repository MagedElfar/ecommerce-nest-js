import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { AttributeValues } from '../attribute-values/attribute-values.entity';
import { ProductVariations } from '../product-variations/product-variations.entity';

@Table({
    tableName: 'product_variations_attributes',
})
export class ProductVariationAttribute extends Model<ProductVariationAttribute> {

    @ForeignKey(() => ProductVariations)
    @Column
    productVariationId: number;

    @BelongsTo(() => ProductVariations, { onDelete: "CASCADE" })
    proVar: ProductVariations;

    @ForeignKey(() => AttributeValues)
    @Column
    attrId: number;

    @BelongsTo(() => AttributeValues, { onDelete: "CASCADE" })
    attribute: AttributeValues;


} 
