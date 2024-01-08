import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class UserQueryDto extends QueryDto {
    @ApiPropertyOptional({
        description: "username",
        example: "maged",
    })
    @IsOptional()
    @IsString()
    name: string = ""
}