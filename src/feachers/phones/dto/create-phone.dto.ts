import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreatePhoneDto {

    @ApiProperty({
        description: "phone number",
        example: "+1234567890",
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    phone: string

    userId?: number
}