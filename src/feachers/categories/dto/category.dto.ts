import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { AttributeValueDto } from "src/feachers/attributes-values/dto/attribute-value.dto";
import { BrandDto } from "src/feachers/brands/dto/brand.dto";
import { MediaDto } from "src/feachers/media/dto/media.dto";
import { SubCategoryDto } from "src/feachers/sub-categories/dto/request/sub-category.dto";

export class CategoryDto extends BaseDto {
    @ApiProperty({
        description: "category name",
        example: "clothes"
    })
    name: string;

    @ApiProperty({
        description: "category slug",
        example: "clothes"
    })
    slug: string;

    @ApiProperty({
        description: "sub categories",
        isArray: true
    })
    subCategories: SubCategoryDto

    @ApiProperty({
        description: "image id",
        example: 1
    })
    imageId: number

    @ApiProperty({
        description: "image object",
    })
    image: MediaDto

    @ApiProperty({
        description: "image attributes",
        isArray: true
    })
    attributes: AttributeValueDto;

    @ApiProperty({
        description: "image attributes",
        isArray: true
    })
    brands: BrandDto;

    @ApiProperty({
        description: "number of products belong to the category",
        example: 1
    })
    totalProducts: number;
}