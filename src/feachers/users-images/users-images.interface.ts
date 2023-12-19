import { IMedia } from "src/core/interface/media.interface";
import { IModel } from "src/core/interface/model.interface";
import { IUser } from "src/feachers/users/users.interface";

export interface IUserImage extends IMedia {

    userId?: number;

    user?: IUser;

}