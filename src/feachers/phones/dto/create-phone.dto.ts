import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator"
import { IsAllow } from "src/core/decorators/is-allow.validation.decorator"

export class CreatePhoneDto {

    @ApiProperty({
        description: "phone number",
        example: "+1234567890",
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    phone: string

    @ApiProperty({
        description: "user id",
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @IsAllow()
    userId?: number

    @IsOptional()
    context?: any
}