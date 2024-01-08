import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class MediaDto extends BaseDto {

    @ApiPropertyOptional({
        description: "media url or link",
        example: "http://localhost:3000/public/img.png"
    })
    url: string;

    @ApiPropertyOptional({
        description: "media storage key used for manage media on the cloud",
        example: "/public/img.png"
    })
    storageKey: string


    @ApiPropertyOptional({
        description: "media photo",
        example: "photo"
    })
    type: string
}