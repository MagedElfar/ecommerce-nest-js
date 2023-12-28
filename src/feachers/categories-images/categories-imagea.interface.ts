import { IMedia } from "src/core/interface/media.interface";
import { Category } from "../categories/categories.entity";

export interface ICategoryImage extends IMedia {
    categoryId?: number;
    category?: Category
}