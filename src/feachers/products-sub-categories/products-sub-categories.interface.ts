import { IModel } from "src/core/interface/model.interface";
import { SubCategory } from "../sub-categories/sub-categories.entity";
import { Product } from "../products/products.entity";

export interface IProductSubCategory extends IModel {

    productId?: number;

    product: Product;

    subCategoryId?: number;

    subCategory?: SubCategory;

}