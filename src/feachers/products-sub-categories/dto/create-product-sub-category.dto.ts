import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateProductSubCategoryDto {
    @ApiProperty({
        description: "product id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    productId: number

    @ApiProperty({
        description: "sub category id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    subCategoryId: number
}