import { IModel } from "src/core/interface/model.interface";
import { AttributeValues } from "../attributes-values/attributes-values.entity";

export interface IAttribute extends IModel {
    name?: string,
    values?: AttributeValues[]
}