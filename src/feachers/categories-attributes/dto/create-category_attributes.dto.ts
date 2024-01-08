import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateCategoryAttributesDto {
    @ApiProperty({
        description: "category id"
    })
    @IsNotEmpty()
    @IsInt()
    categoryId: number

    @ApiProperty({
        description: "attribute id"
    })
    @IsNotEmpty()
    @IsInt()
    attributeId: number
}