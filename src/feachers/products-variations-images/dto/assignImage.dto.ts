import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt, Min } from "class-validator";
export class AssignImageDto {

    @ApiProperty({
        description: "product variant id"
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    variationId: number

    @ApiProperty({
        description: "imageId id"
    })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    imageId: number
}