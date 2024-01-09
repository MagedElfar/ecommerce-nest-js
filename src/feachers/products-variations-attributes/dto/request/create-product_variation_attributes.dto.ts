import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateProductAttributesDto {

    @ApiProperty({
        description: "product variation id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    productVariationId: number

    @ApiProperty({
        description: "attribute value id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    attrId: number
}