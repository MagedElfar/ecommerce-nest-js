import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { transformFloat } from "src/core/pipes/parseFloat.pipe";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string

    @Transform((param) => transformFloat(param))
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number

    userId?: number
}