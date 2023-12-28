import { IModel } from "src/core/interface/model.interface";
import { Product } from "../products/products.entity";
import { IAttributeValue } from "../attributes-values/attributes-values.interface";
import { ProductVariationImage } from "../products-variations-images/products-variations-images.entity";

export interface IProductVariation extends IModel {
    quantity?: number

    productId?: number

    product?: Product

    sku?: string,

    attributes?: IAttributeValue[],

    images: ProductVariationImage[]

}