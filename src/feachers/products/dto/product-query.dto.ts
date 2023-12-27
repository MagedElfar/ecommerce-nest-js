import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, IsArray } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { transformFloat } from "src/core/pipes/parseFloat.pipe";
import { transformInt } from "src/core/pipes/parseInt.pipe";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class ProductQueryDto extends QueryDto {
    @IsOptional()
    @IsString()
    name: string = ""

    @Transform(param => transformInt(param))
    @IsOptional()
    @IsInt()
    categoryId: number

    @Transform(param => transformInt(param))
    @IsOptional()
    @IsInt()
    subCategoryId: number

    @Transform(param => transformInt(param))
    @IsOptional()
    @IsInt()
    brandId: number

    @Transform(param => transformFloat(param))
    @IsOptional()
    @IsNumber()
    minPrice: number

    @Transform(param => transformFloat(param))
    @IsOptional()
    @IsNumber()
    maxPrice: number


    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Transform(({ value }) => value.map(Number)) // Transform each element to a number
    attributes: number[]
}