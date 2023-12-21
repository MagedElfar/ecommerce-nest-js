import { IModel } from "src/core/interface/model.interface";
import { Product } from "../products/product.entity";

export interface IProductVariation extends IModel {
    quantity?: number

    productId?: number

    product?: Product

    sku?: string

}