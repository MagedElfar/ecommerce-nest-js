import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { MediaDto } from "src/feachers/media/dto/media.dto";

export class BrandDto extends BaseDto {

    @ApiPropertyOptional({
        description: "brand name",
        uniqueItems: true,
        example: "adidas"
    })
    name: string

    @ApiPropertyOptional({
        description: "brand slug",
        uniqueItems: true,
        example: "adidas"
    })
    slug: string

    @ApiPropertyOptional({
        description: "brand image id",
        uniqueItems: true,
        example: "adidas"
    })
    imageId: number

    @ApiPropertyOptional({
        description: "brand image object",
        uniqueItems: true,
    })
    image: MediaDto

}