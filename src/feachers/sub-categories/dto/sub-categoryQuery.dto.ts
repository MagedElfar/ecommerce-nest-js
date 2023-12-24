import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class SubCategoryQueryDto extends QueryDto {
    @IsOptional()
    @IsString()
    @Transform((param) => transformLowerCase(param))
    name: string = ""

}