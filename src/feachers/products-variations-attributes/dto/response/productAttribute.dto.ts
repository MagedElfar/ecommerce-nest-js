import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class ProductAttributeDto extends BaseDto {
    @ApiProperty({
        description: "product variation id",
        example: 1
    })
    productVariationId: number;


    @ApiProperty({
        description: "attribute value id",
        example: 1
    })
    attrId: number;
}