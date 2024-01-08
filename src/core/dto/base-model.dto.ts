import { ApiPropertyOptional } from "@nestjs/swagger";
import { IModel } from "src/core/interface/model.interface";

export class BaseDto implements IModel {

    @ApiPropertyOptional({ description: "record id", example: 1 })
    id: number

    @ApiPropertyOptional({ description: "record created date" })
    createdAt: string

    @ApiPropertyOptional({ description: "record updated date" })
    updatedAt: string
}