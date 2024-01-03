import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateOrderItemDto {

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    orderId?: number


    @IsNotEmpty()
    @IsNumber()
    productId: number


    @IsNotEmpty()
    @IsNumber()
    variantId: number

}