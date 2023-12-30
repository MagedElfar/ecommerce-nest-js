import { IsNotEmpty, IsNumber, Min } from "class-validator"

export class CreateItemDto {

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    variantId: number

    userId?: number
}