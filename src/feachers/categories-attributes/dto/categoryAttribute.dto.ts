import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class CategoryAttributeDto extends BaseDto {

    @ApiProperty({
        description: "category id",
        example: 1
    })
    categoryId: number;

    @ApiProperty({
        description: "attribute id",
        example: 1
    })
    attributeId: number
}