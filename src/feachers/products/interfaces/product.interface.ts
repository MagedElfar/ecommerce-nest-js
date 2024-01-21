import { IModel } from "src/core/interface/model.interface";

export interface IProduct extends IModel {
    name?: string;
    slug?: string;
    description?: string
    price?: number
    userId?: number
    brandId?: number
    imageId?: number
}