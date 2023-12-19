import { IModel } from "./model.interface";

export interface IMedia extends IModel {
    url?: string;

    storageKey?: string
}