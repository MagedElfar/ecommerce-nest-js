import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { AttributeValueWithTotalDto } from "src/feachers/attributes-values/dto/response/attributeValue.dto";

export class AttributeDto extends BaseDto {
    @ApiProperty({
        description: "attribute name",
        example: "color"
    })
    name: string

    @ApiProperty({
        description: "attribute values",
        isArray: true
    })
    values: AttributeValueWithTotalDto
}