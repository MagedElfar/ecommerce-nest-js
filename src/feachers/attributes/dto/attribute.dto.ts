import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { AttributeValueDto } from "src/feachers/attributes-values/dto/attribute-value.dto";

export class AttributeDto extends BaseDto {

    @ApiPropertyOptional({
        description: "Attribute name",
        example: "color",
        uniqueItems: true
    })
    nama: string

    @ApiPropertyOptional({
        description: "Attribute values",
        isArray: true
    })
    values: AttributeValueDto
}