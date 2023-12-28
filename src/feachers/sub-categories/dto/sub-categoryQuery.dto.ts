import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { transformInt } from "src/core/pipes/parseInt.pipe";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class SubCategoryQueryDto extends QueryDto {
    @IsOptional()
    @IsString()
    @Transform((param) => transformLowerCase(param))
    name: string = ""

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform((param) => transformInt(param))
    categoryId: number

}