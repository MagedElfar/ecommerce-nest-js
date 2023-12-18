import { Transform } from "class-transformer"
import { IsInt, IsOptional, Min } from "class-validator"
import { transformInt } from "../pipes/parseInt.pipe"

export class QueryDto {
    @Transform((param) => transformInt(param))
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly limit: number = 10

    @Transform((param) => transformInt(param))
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1
}