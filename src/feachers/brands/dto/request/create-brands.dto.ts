import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateBrandDto {

    @IsString()
    @IsNotEmpty()
    @Transform((param) => transformLowerCase(param))
    @ApiProperty({
        description: "brand name",
        uniqueItems: true,
        example: "samsung"
    })
    name: string
}