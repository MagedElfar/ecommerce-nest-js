import { IsInt, IsNotEmpty } from "class-validator";

export class CreateProductAttributesDto {
    @IsNotEmpty()
    @IsInt()
    productVariationId: number

    @IsNotEmpty()
    @IsInt()
    attrId: number
}