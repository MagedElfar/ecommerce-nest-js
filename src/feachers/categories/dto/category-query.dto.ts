import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CategoryQueryDto extends QueryDto {
    @ApiPropertyOptional({
        description: "category name",
    })
    @IsOptional()
    @IsString()
    @Transform((param) => transformLowerCase(param))
    name: string = ""
}