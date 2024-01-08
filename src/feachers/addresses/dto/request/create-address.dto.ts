import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateAddressDto {

    @ApiProperty({
        example: 'Egypt',
        description: "Address country name"
    })
    @IsNotEmpty()
    @IsString()
    country: string

    @ApiProperty({
        example: 'Alexandria',
        description: "Address city name"
    })
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty({
        example: "12 - street num",
        description: "your street name"
    })
    @IsNotEmpty()
    @IsString()
    street: string

    @ApiProperty({
        example: "32 floor 5 at somewhere",
        description: "your address details like floor and apartment num etc..."
    })
    @IsNotEmpty()
    @IsString()
    addressLine: string

    userId?: number
}