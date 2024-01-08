import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { MediaDto } from "src/feachers/media/dto/media.dto";

export class SubCategoryDto extends BaseDto {

    @ApiProperty({
        description: "sub category name",
        example: "shirts"
    })
    name: string;

    @ApiProperty({
        description: "sub category slug",
        example: "shirts"
    })
    slug: string;

    @ApiProperty({
        description: "parent category id",
        example: 1
    })
    categoryId: number

    @ApiProperty({
        description: "image id",
        example: 1
    })
    imageId: number

    @ApiProperty({
        description: "image object",
    })
    image: MediaDto

}