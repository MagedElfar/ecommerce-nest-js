import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateCategoryBrandDto {
    @ApiProperty({
        description: "category id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    categoryId: number

    @ApiProperty({
        description: "brand id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    brandId: number
}