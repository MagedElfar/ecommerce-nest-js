import { IMedia } from "src/core/interface/media.interface";
import { ProductVariations } from "../products-variations/products-variations.entity";

export interface IProductVariationImage extends IMedia {
    productVariationId: number;
    productVariation: ProductVariations;
}