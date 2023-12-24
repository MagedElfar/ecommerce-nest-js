import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";
import { ProductVariations } from "../product-variations/product-variations.entity";

export interface IProduct extends IModel {
    name?: string;
    slug?: string;
    description?: string
    price?: number
    userId?: number
    user?: User
    variations?: ProductVariations[],
    attributes?: { [key: string]: string[] }[]
}