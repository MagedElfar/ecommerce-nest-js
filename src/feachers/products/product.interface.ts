import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";

export interface IProduct extends IModel {
    name: string;
    slug: string;
    description: string
    price: number
    userId: number
    user: User
}