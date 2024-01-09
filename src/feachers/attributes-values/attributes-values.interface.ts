import { CategoriesAttribute } from 'src/feachers/categories-attributes/categories-attributes.entity';
import { IModel } from "src/core/interface/model.interface";
import { Attribute } from "../attributes/attribute.entity";

export interface IAttributeValue extends IModel {
    value?: string,
    attributeId?: number,
    attribute?: Attribute,
    categoryAttribute?: CategoriesAttribute
}