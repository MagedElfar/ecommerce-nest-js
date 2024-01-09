import { PartialType, OmitType } from "@nestjs/swagger";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
    ArrayMinSize,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
    IsArray
} from "class-validator";
import { transformFloat } from "src/core/pipes/parseFloat.pipe";
import { CreateProductSubCategoryDto } from "src/feachers/products-sub-categories/dto/request/create-product-sub-category.dto";
import { CreateProductVariationDto } from "src/feachers/products-variations/dto/request/create-product-variations.dto";

class CreateProductSubCategoryDtoOmitted extends OmitType(CreateProductSubCategoryDto, ["productId"]) { }
class CreateProductVariationDtoOmitted extends OmitType(CreateProductVariationDto, ['productId']) { }

export class CreateProductDto {

    @ApiProperty({
        description: "product name",
        example: "product name"
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: "product description",
        example: "product description"
    })
    @IsOptional()
    @IsString()
    description: string

    @ApiProperty({
        description: "product Price",
        example: 100.25
    })
    @Transform((param) => transformFloat(param))
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number

    userId?: number

    @ApiPropertyOptional({
        description: "category id",
        example: 1
    })
    @IsOptional()
    @IsInt()
    categoryId: number

    @ApiPropertyOptional({
        description: "brand id",
        example: 1
    })
    @IsOptional()
    @IsInt()
    brandId: number

    @ApiProperty({
        description: "product variations",
        type: CreateProductVariationDtoOmitted,
        isArray: true
    })
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OmitType(CreateProductVariationDto, ['productId']))
    variations: CreateProductVariationDto[]

    @ApiPropertyOptional({
        description: "sub categories",
        isArray: true,
        type: CreateProductSubCategoryDtoOmitted
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OmitType(CreateProductSubCategoryDto, ['productId']))
    subCategories?: CreateProductSubCategoryDto[]
}