import { IModel } from "src/core/interface/model.interface";
import { IProduct } from "src/feachers/products/interfaces/product.interface";

export interface IProductVariation extends IModel {
    quantity?: number

    productId?: number

    product?: IProduct

    sku?: string,

    attributes?: any[],

    name?: string,

    price?: number

}