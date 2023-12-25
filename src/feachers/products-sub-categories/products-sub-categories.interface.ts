import { IModel } from "src/core/interface/model.interface";
import { SubCategory } from "../sub-categories/sub-category.entity";
import { Product } from "../products/product.entity";

export interface IProductSubCategory extends IModel {

    productId?: number;

    product: Product;

    subCategoryId?: number;

    subCategory?: SubCategory;

}