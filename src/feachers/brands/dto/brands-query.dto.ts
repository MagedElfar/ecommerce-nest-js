import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class BrandQueryDto extends QueryDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "brand name",
    })
    name: string = ""
}