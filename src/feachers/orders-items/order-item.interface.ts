import { IModel } from "src/core/interface/model.interface";
import { IProduct } from "../products/products.interface";
import { ProductVariations } from "../products-variations/products-variations.entity";

export interface IOrderItem extends IModel {

    quantity?: number

    orderId?: number

    productId?: number

    product?: IProduct;

    variantId?: number

    variant?: ProductVariations;

}