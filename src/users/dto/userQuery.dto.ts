import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class UserQueryDto extends QueryDto {
    @IsOptional()
    @IsString()
    name: string = ""
}