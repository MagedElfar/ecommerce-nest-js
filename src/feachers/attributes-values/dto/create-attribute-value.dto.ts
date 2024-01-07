import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateAttributeValueDto {
    @Transform((param) => transformLowerCase(param))
    @IsNotEmpty()
    @IsString()
    @ApiPropertyOptional({
        description: "value name",
        example: "red",
        uniqueItems: true
    })
    value: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({
        description: "attribute id",
        example: 1,
    })
    attributeId: number;
}