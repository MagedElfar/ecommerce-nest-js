import { IMedia } from "src/core/interface/media.interface";
import { Category } from "../categories/category.entity";

export interface ICategoryImage extends IMedia {
    categoryId?: number;
    category?: Category
}