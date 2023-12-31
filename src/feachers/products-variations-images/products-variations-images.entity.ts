import { Media } from '../media/media.entity';
import { ProductVariations } from '../products-variations/products-variations.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: "products_variations_images" })
export class ProductVariationImage extends Model<ProductVariationImage> {

    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id: number;

    @ForeignKey(() => ProductVariations)
    @Column
    variationId: number;

    @BelongsTo(() => ProductVariations, { onDelete: "CASCADE" })
    productVariation: ProductVariations;

    @ForeignKey(() => Media)
    @Column
    imageId: number;

    @BelongsTo(() => Media, { onDelete: "CASCADE" })
    image: Media;

}
