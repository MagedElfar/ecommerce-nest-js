import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";
import { Brand } from "../brands/brands.entity";
import { SubCategory } from "../sub-categories/sub-categories.entity";
import { ProductVariations } from "../products-variations/products-variations.entity";
import { Media } from "../media/media.entity";

export interface IProduct extends IModel {
    name?: string;
    slug?: string;
    description?: string
    price?: number
    userId?: number
    user?: User
    variations?: ProductVariations[],
    attributes?: { [key: string]: string[] }[],
    brandId?: number
    brand?: Brand
    subCategories?: SubCategory[],
    image?: Media,
    imageId?: number
}