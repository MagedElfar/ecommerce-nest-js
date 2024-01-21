import { IModel } from "src/core/interface/model.interface";

export interface IBrand extends IModel {
    name?: string
    slug?: string
    imageId?: number
    categoryId?: number
}