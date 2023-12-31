import { IsNotEmpty, IsString } from "class-validator"

export class CreateAddressDto {

    @IsNotEmpty()
    @IsString()
    country: string

    @IsNotEmpty()
    @IsString()
    city: string

    @IsNotEmpty()
    @IsString()
    street: string

    @IsNotEmpty()
    @IsString()
    addressLine: string

    userId?: number
}