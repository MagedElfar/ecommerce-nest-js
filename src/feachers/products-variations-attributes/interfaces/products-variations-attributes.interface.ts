import { IModel } from "src/core/interface/model.interface";
import { ProductVariations } from "../../products-variations/entities/products-variations.entity";
import { Media } from "../../media/entities/media.entity";

export interface IProductVariationAttributes extends IModel {

    productVariationId?: number;

    attrId?: number;

}