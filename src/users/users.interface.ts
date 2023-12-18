import { UserRole } from "src/core/constants"
import { IModel } from "src/core/interface/model.interface"
import { IUserImage } from "src/users-images/users-images.interface"

export interface IUser extends IModel {
    name?: string
    email?: string
    password?: string,
    role: UserRole,
    images?: IUserImage[]
}