import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateAttributeValueDto {
    @Transform((param) => transformLowerCase(param))
    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    attributeId: number;
}