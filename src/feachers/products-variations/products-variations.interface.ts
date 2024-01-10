import { IModel } from "src/core/interface/model.interface";
import { Product } from "../products/products.entity";
import { IAttributeValue } from "../attributes-values/attributes-values.interface";
import { Media } from "../media/media.entity";
import { IProductVariationAttributes } from "../products-variations-attributes/products-variations-attributes.interface";

export interface IProductVariation extends IModel {
    quantity?: number

    productId?: number

    product?: Product

    sku?: string,

    attributes?: IAttributeValue[] | IProductVariationAttributes[],

    image?: Media[]

    name?: string,

    price?: number

}