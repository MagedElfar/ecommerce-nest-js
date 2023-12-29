import { IModel } from "src/core/interface/model.interface";
import { SubCategory } from "../sub-categories/sub-categories.entity";
import { CategoryImage } from "../categories-images/categories-images.entity";
import { Brand } from "../brands/brands.entity";

export interface ICategory extends IModel {
    name?: string
    slug?: string
    subCategories: SubCategory[],
    image?: CategoryImage
    brands?: Brand[],
    attributes: any
}