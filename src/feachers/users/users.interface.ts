import { UserRole } from "src/core/constants"
import { IModel } from "src/core/interface/model.interface"


export interface IUser extends IModel {

    name?: string
    email?: string
    password?: string,
    role?: UserRole,
    imageId?: number
}