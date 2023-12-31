import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";

export interface IPhone extends IModel {

    phone?: string

    userId?: number

    user?: User;
}