import { UserRole } from "src/core/constants"
import { IModel } from "src/core/interface/model.interface"
import { Media } from "../media/media.entity"
import { Address } from "../addresses/address.entity"
import { Phone } from "../phones/phone.entity"

export interface IUser extends IModel {
    name?: string
    email?: string
    password?: string,
    role: UserRole,
    imageId?: number
    image?: Media
    addresses: Address[]
    phones: Phone[]
}