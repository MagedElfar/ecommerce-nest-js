import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateOrderItemDto {

    @ApiProperty({
        description: "quantity"
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number

    orderId?: number

    @ApiProperty({
        description: "variant id"
    })
    @IsNotEmpty()
    @IsNumber()
    variantId: number

}