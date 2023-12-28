import { IModel } from "src/core/interface/model.interface";
import { Category } from "../categories/categories.entity";
import { Product } from "../products/products.entity";
import { SubCategoryImage } from "../sub-categories-images/sub-categories-images.entity";

export interface ISubCategory extends IModel {
    name?: string
    slug?: string
    categoryId?: number,
    category?: Category,
    image?: SubCategoryImage,
    products?: Product[]
}