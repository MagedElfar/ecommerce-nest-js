import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class CategoryBrandDto extends BaseDto {

    @ApiProperty({
        description: "category id",
        example: 1
    })
    categoryId: number;

    @ApiProperty({
        description: "brand id",
        example: 1
    })
    brandId: number
}