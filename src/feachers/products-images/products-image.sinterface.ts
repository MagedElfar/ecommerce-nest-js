import { IMedia } from "src/core/interface/media.interface";
import { Product } from "../products/products.entity";

export interface IProductImage extends IMedia {
    productId?: number;
    product?: Product
}