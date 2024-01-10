import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, Min } from "class-validator"
import { BaseDto } from "src/core/dto/base-model.dto"

export class CreateItemDto {

    @ApiProperty({
        description: "quantity"
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number

    @ApiProperty({
        description: "product variant id"
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    variantId: number

    userId?: number
}

