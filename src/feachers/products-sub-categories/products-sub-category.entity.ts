import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Product } from '../products/product.entity';
import { SubCategory } from '../sub-categories/sub-category.entity';

@Table({
    tableName: 'products_sub_categories',
})
export class ProductSubCategory extends Model<ProductSubCategory> {

    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id: number;

    @ForeignKey(() => Product)
    @Column({
        allowNull: false
    })
    productId: number;

    @BelongsTo(() => Product, { foreignKey: { name: "productId" }, onDelete: "CASCADE" })
    product: Product;

    @ForeignKey(() => SubCategory)
    @Column
    subCategoryId: number;

    @BelongsTo(() => SubCategory, { onDelete: "CASCADE" })
    subCategory: SubCategory;


}