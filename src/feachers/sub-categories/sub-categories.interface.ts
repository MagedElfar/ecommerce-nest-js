import { IModel } from "src/core/interface/model.interface";
import { Category } from "../categories/categories.entity";
import { Product } from "../products/products.entity";
import { Media } from "../media/media.entity";

export interface ISubCategory extends IModel {
    name?: string
    slug?: string
    categoryId?: number,
    category?: Category,
    imageId?: number
    image?: Media
    products?: Product[]
}