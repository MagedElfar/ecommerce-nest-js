import { IModel } from "src/core/interface/model.interface";
import { AttributeValues } from "../attributes-values/attributes-values.entity";
import { ProductVariations } from "../products-variations/products-variations.entity";
import { Media } from "../media/media.entity";

export interface IProductVariationAttributes extends IModel {

    productVariationId?: number;

    proVar?: ProductVariations;

    attrId?: number;

    attribute?: AttributeValues;
}