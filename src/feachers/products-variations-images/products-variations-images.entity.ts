import { ProductVariations } from '../products-variations/products-variations.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({ tableName: "products_variations_images" })
export class ProductVariationImage extends Model<ProductVariationImage> {
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

    @ForeignKey(() => ProductVariations)
    @Column
    productVariationId: number;

    @BelongsTo(() => ProductVariations, { onDelete: "CASCADE" })
    productVariation: ProductVariations;

}
