import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class UserQueryDto extends QueryDto {
    @ApiPropertyOptional({
        description: "search term 'search in username , first name or last name'",
    })
    @IsOptional()
    @IsString()
    term: string = ""

    @ApiPropertyOptional({
        description: "user email",
    })
    @IsOptional()
    @IsString()
    email: string
}