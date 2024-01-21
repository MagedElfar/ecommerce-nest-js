import { UserRole } from "src/core/constants"
import { IModel } from "src/core/interface/model.interface"
import { Media } from "../media/entities/media.entity"
import { Address } from "../addresses/entities/address.entity"
import { Phone } from "../phones/entities/phone.entity"
import { ApiPropertyOptional } from "@nestjs/swagger"

export interface IUser extends IModel {

    name?: string
    email?: string
    password?: string,
    role?: UserRole,
    imageId?: number
    image?: Media
    addresses?: Address[]
    phones?: Phone[]
}