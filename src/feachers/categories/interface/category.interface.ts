import { IModel } from "src/core/interface/model.interface";


export interface ICategory extends IModel {
    name?: string
    slug?: string
    imageId?: number
}