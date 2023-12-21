import { PartialType, OmitType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { transformFloat } from "src/core/pipes/parseFloat.pipe";
import { CreateProductVariationDto } from "src/feachers/product-variations/dto/create-product-variations.dto";

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

    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateProductVariationDto, ['productId'])))
    variant: CreateProductVariationDto
}