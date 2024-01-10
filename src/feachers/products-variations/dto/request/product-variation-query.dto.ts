import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class VariationQueryDto extends QueryDto {
    @ApiPropertyOptional({
        description: "variation name or sku"
    })
    @IsOptional()
    @IsString()
    searchTerm: string = ""
}