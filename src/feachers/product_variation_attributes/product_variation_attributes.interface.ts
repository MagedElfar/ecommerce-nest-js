import { IModel } from "src/core/interface/model.interface";
import { ProductVariations } from "../product-variations/product-variations.entity";
import { AttributeValues } from "../attribute-values/attribute-values.entity";

export interface IProductVariationAttributes extends IModel {

    productVariationId?: number;

    proVar?: ProductVariations;

    attrId?: number;

    attribute?: AttributeValues;
}