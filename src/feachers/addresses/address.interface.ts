import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";

export interface IAddress extends IModel {

    country?: string

    city?: string

    street?: string

    addressLine?: string

    userId?: number

    user?: User;
}