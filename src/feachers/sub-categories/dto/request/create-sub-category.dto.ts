import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateSubCategoryDto {

    @ApiProperty({
        description: "sub category name",
        example: "headphones"
    })
    @IsString()
    @IsNotEmpty()
    @Transform((param) => transformLowerCase(param))
    name: string

    @ApiProperty({
        description: "category id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    categoryId: number
}