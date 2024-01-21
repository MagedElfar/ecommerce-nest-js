import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateCategoryDto {

    @ApiProperty({
        description: "category name",
        uniqueItems: true,
        example: "clothes"
    })
    @IsString()
    @IsNotEmpty()
    @Transform((param) => transformLowerCase(param))
    name: string
}