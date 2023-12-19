import { IModel } from "src/core/interface/model.interface";
import { ICategoryImage } from "../category-image/category-image.interface";

export interface ICategory extends IModel {
    name?: string
    slug?: string
    image?: ICategoryImage
}