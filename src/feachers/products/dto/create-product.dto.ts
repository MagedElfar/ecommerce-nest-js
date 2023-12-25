import { PartialType, OmitType } from "@nestjs/mapped-types";
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
import { CreateProductVariationDto } from "src/feachers/product-variations/dto/create-product-variations.dto";
import { CreateProductSubCategoryDto } from "src/feachers/products-sub-categories/dto/create-product-sub-category.dto";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string

    @Transform((param) => transformFloat(param))
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number

    userId?: number

    @IsOptional()
    @IsInt()
    categoryId: number

    @IsOptional()
    @IsInt()
    brandId: number

    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateProductVariationDto, ['productId'])))
    variations: CreateProductVariationDto[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateProductSubCategoryDto, ['productId'])))
    subCategories?: CreateProductSubCategoryDto[]
}