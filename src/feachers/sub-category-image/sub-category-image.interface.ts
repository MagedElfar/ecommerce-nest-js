import { IMedia } from "src/core/interface/media.interface";
import { Category } from "../categories/category.entity";
import { SubCategory } from "../sub-categories/sub-category.entity";

export interface ISubCategoryImage extends IMedia {
    subCategoryId?: number;
    subCategory?: SubCategory
}