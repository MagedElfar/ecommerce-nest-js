import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { Brand } from "src/feachers/brands/entities/brands.entity";
import { MediaDto } from "src/feachers/media/dto/media.dto";

export class SubCategoryDto extends BaseDto {
    @ApiPropertyOptional({
        description: "category name",
        uniqueItems: true,
        example: "shirts"
    })
    name: string

    @ApiPropertyOptional({
        description: "category slug",
        uniqueItems: true,
        example: "category-shirts"
    })
    slug: string

    @ApiPropertyOptional({
        description: "number of products belongs to the category",
        example: 1
    })
    totalProducts: number

    @ApiPropertyOptional({
        description: "category image id",
        example: 1
    })
    imageId: number

    @ApiPropertyOptional({
        description: "category image object",
    })
    image: MediaDto
}