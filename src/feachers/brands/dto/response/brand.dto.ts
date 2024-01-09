import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { MediaDto } from "src/feachers/media/dto/media.dto";

export class BrandDto extends BaseDto {

    @ApiProperty({
        description: "brand name",
        uniqueItems: true,
        example: "samsung"
    })
    name: string

    @ApiProperty({
        description: "brand slug",
        uniqueItems: true,
        example: "samsung"
    })
    slug: string

    @ApiProperty({
        description: "image id",
        example: 1
    })
    imageId: number

    @ApiProperty({
        description: "image object",
        uniqueItems: true,
    })
    image: MediaDto
}