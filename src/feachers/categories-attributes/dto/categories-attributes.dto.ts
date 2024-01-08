import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class CategoryAttributeDto extends BaseDto {
    @ApiPropertyOptional({
        description: "category id"
    })
    categoryId: number

    @ApiPropertyOptional({
        description: "attribute id"
    })
    attributeId: number
}