import { IMedia } from "src/core/interface/media.interface";
import { SubCategory } from "../sub-categories/sub-categories.entity";

export interface ISubCategoryImage extends IMedia {
    subCategoryId?: number;
    subCategory?: SubCategory
}