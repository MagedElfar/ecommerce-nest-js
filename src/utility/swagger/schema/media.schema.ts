import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseSchema } from "./base.schema";

export class MediaSchema extends BaseSchema {

    @ApiPropertyOptional({ description: "media url" })
    url: string;

    @ApiPropertyOptional({ description: "media cloud key" })
    storageKey: string

    @ApiPropertyOptional({ description: "media type ex: image , video etc..." })
    type: string
}