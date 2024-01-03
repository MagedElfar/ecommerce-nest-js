import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateAddressDto {

    @ApiProperty({
        example: 'Egypt , USA etc...',
        description: "Address country name"
    })
    @IsNotEmpty()
    @IsString()
    country: string

    @ApiProperty({
        example: 'Alexandria , Cairo etc...',
        description: "Address city name"
    })
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty({
        description: "your street name"
    })
    @IsNotEmpty()
    @IsString()
    street: string

    @ApiProperty({
        description: "your address details like floor and apartment num etc..."
    })
    @IsNotEmpty()
    @IsString()
    addressLine: string

    userId?: number
}