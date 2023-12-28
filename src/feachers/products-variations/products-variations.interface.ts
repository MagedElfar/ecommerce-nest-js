import { IModel } from "src/core/interface/model.interface";
import { Product } from "../products/products.entity";
import { IAttributeValue } from "../attributes-values/attributes-values.interface";

export interface IProductVariation extends IModel {
    quantity?: number

    productId?: number

    product?: Product

    sku?: string,

    attributes?: IAttributeValue[]

}