import { IModel } from "../../core/interface/model.interface";

export interface IMedia extends IModel {
    url?: string;

    storageKey?: string

    type?: string
}