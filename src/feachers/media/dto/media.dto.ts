import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class MediaDto extends BaseDto {

    @ApiPropertyOptional({
        description: "media url or link"
    })
    url: string;

    @ApiPropertyOptional({
        description: "media storage key"
    })
    storageKey: string


    @ApiPropertyOptional({
        description: "media photo",
        example: "Photo"
    })
    type: string
}