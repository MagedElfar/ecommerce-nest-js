import { IModel } from "src/core/interface/model.interface";
import { Product } from "../products/products.entity";
import { BrandImage } from "../brands-images/brands-images.entity";
import { Category } from "../categories/categories.entity";

export interface IBrand extends IModel {
    name?: string
    slug?: string
    image?: BrandImage,
    products?: Product[]
    categoryId?: number
    category: Category
}