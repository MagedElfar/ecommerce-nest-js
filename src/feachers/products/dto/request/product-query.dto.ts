import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, IsArray } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { transformFloat } from "src/core/pipes/parseFloat.pipe";
import { transformInt } from "src/core/pipes/parseInt.pipe";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class ProductQueryDto extends QueryDto {

    @ApiPropertyOptional({
        description: "product name"
    })
    @IsOptional()
    @IsString()
    name: string = ""

    @ApiPropertyOptional({
        description: "category id"
    })
    @Transform(param => transformInt(param))
    @IsOptional()
    @IsInt()
    categoryId: number

    @ApiPropertyOptional({
        description: "sub category id"
    })
    @Transform(param => transformInt(param))
    @IsOptional()
    @IsInt()
    subCategoryId: number

    @ApiPropertyOptional({
        description: "brands ids",
        isArray: true,
        type: Number
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : Array(value).map(Number))) // Transform each element to a number
    brands: number[]

    @ApiPropertyOptional({
        description: "min price range",
    })
    @Transform(param => transformFloat(param))
    @IsOptional()
    @IsNumber()
    minPrice: number

    @ApiPropertyOptional({
        description: "max price range",
    })
    @Transform(param => transformFloat(param))
    @IsOptional()
    @IsNumber()
    maxPrice: number

    @ApiPropertyOptional({
        description: "attributes id",
        isArray: true,
        type: Number
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : Array(value).map(Number))) // Transform each element to a number
    attributes: number[]
}