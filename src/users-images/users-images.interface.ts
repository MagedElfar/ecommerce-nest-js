import { IModel } from "src/core/interface/model.interface";
import { IUser } from "src/users/users.interface";

export interface IUserImage extends IModel {

    url?: string;

    storageKey?: string

    userId?: number;

    user?: IUser;

}