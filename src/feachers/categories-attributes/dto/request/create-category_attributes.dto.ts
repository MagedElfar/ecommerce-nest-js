import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateCategoryAttributesDto {
    @ApiProperty({
        description: "category id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    categoryId: number

    @ApiProperty({
        description: "attribute id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    attributeId: number
}