import { IModel } from "src/core/interface/model.interface";
import { Product } from "../products/products.entity";
import { Category } from "../categories/categories.entity";
import { Media } from "../media/media.entity";

export interface IBrand extends IModel {
    name?: string
    slug?: string
    imageId?: number
    image?: Media
    products?: Product[]
    categoryId?: number
    categories: Category[]
}