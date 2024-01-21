import { IModel } from "src/core/interface/model.interface";

export interface ISubCategory extends IModel {
    name?: string
    slug?: string
    categoryId?: number,
    imageId?: number
}