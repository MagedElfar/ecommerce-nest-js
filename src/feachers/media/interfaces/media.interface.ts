import { IModel } from "src/core/interface/model.interface";

export interface IMedia extends IModel {
    url?: string;

    storageKey?: string

    type?: string
}