import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateAttributeValueDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "value name",
        example: "red",
        uniqueItems: true
    })
    value: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @ApiProperty({
        description: "attribute id",
        example: 1,
    })
    attributeId: number;
}