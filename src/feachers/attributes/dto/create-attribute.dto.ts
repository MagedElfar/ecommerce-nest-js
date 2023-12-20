import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateAttributeDto {
    @Transform((param) => transformLowerCase(param))
    @IsNotEmpty()
    @IsString()
    name: string;
}