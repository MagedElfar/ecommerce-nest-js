import { IModel } from "src/core/interface/model.interface";
import { AttributeValues } from "../attribute-values/attribute-values.entity";

export interface IAttribute extends IModel {
    name?: string,
    values?: AttributeValues[]
}