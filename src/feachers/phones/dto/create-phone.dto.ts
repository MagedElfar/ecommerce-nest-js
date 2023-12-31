import { IsNotEmpty, IsString } from "class-validator"

export class CreatePhoneDto {

    @IsNotEmpty()
    @IsString()
    phone: string

    userId?: number
}