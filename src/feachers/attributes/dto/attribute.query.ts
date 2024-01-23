import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class AttributeQueryDto extends QueryDto {

    @ApiPropertyOptional({
        description: "attribute name"
    })
    @IsOptional()
    @IsString()
    term: string = ""
}