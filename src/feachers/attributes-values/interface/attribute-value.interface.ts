import { IModel } from "src/core/interface/model.interface";

export interface IAttributeValue extends IModel {
    value?: string,
    attributeId?: number,
}