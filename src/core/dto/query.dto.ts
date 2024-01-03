import { Transform } from "class-transformer"
import { IsInt, IsOptional, Min } from "class-validator"
import { transformInt } from "../pipes/parseInt.pipe"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class QueryDto {

    @ApiPropertyOptional({
        description: "number or records return ber request",
        default: 10
    })
    @Transform((param) => transformInt(param))
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly limit: number = 10

    @ApiPropertyOptional({
        description: "page",
        default: 1
    })
    @Transform((param) => transformInt(param))
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1
}