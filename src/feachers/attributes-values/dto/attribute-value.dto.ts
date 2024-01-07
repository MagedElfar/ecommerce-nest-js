import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class AttributeValueDto extends BaseDto {

    @ApiPropertyOptional({
        description: "attribute value name",
        example: "red",
        uniqueItems: true
    })
    name: string

    @ApiPropertyOptional({
        description: "attribute id for value belongs to",
        example: 1
    })
    attributeId: string

    @ApiPropertyOptional({
        description: "number of products belongs to this attribute value",
        example: 1
    })
    totalProducts: number
} 