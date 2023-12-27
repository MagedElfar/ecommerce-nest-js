import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";
import { ProductVariations } from "../product-variations/product-variations.entity";
import { Brand } from "../brands/brands.entity";
import { SubCategory } from "../sub-categories/sub-category.entity";
import { ProductImage } from "../products-image/products-image.entity";

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
    image?: ProductImage
}