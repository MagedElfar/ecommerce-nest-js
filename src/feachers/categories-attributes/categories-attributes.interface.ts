import { IModel } from "src/core/interface/model.interface";
import { AttributeValues } from "../attributes-values/attributes-values.entity";
import { Category } from "../categories/categories.entity";

export interface ICategoryAttribute extends IModel {

    categoryId?: number;

    category?: Category;

    attributeId?: number;

    attribute?: AttributeValues;
}