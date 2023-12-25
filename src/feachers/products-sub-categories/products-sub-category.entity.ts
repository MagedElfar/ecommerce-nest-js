import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Product } from '../products/product.entity';
import { SubCategory } from '../sub-categories/sub-category.entity';

@Table({
    tableName: 'products_sub_categories',
})
export class ProductSubCategory extends Model<ProductSubCategory> {

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