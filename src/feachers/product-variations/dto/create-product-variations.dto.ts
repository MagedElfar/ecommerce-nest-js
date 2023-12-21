import { IsNotEmpty, Min, IsInt, IsString } from "class-validator"

export class CreateProductVariationDto {

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    quantity: number

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    productId: number

    @IsNotEmpty()
    @IsString()
    sku: string

}