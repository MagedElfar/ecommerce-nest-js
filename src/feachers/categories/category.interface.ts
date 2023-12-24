import { IModel } from "src/core/interface/model.interface";
import { ICategoryImage } from "../category-image/category-image.interface";
import { ISubCategory } from "../sub-categories/sub-category.interface";
import { SubCategory } from "../sub-categories/sub-category.entity";

export interface ICategory extends IModel {
    name?: string
    slug?: string
    subCategories: SubCategory[],
    image?: ICategoryImage
}