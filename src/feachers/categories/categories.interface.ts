import { IModel } from "src/core/interface/model.interface";
import { SubCategory } from "../sub-categories/sub-categories.entity";
import { Brand } from "../brands/brands.entity";
import { Media } from "../media/media.entity";

export interface ICategory extends IModel {
    name?: string
    slug?: string
    subCategories: SubCategory[],
    imageId?: number
    image?: Media
    brands?: Brand[],
    attributes: any
}