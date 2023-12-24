import { IModel } from "src/core/interface/model.interface";
import { Product } from "../products/product.entity";
import { IAttributeValue } from "../attribute-values/attribute-values.interface";

export interface IProductVariation extends IModel {
    quantity?: number

    productId?: number

    product?: Product

    sku?: string,

    attributes?: IAttributeValue[]

}