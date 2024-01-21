import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class ProductSubCategoryDto extends BaseDto {
    @ApiProperty({
        description: "product id",
        example: 1
    })
    productId: number;


    @ApiProperty({
        description: "subcategory id",
        example: 1
    })
    subCategoryId: number;
}