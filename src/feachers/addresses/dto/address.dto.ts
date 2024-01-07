import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class AddressDto extends BaseDto {

    @ApiPropertyOptional({
        description: "Address country",
        example: "Egypt"
    })
    country: string

    @ApiPropertyOptional({
        description: "Address city",
        example: "Alexandria"
    })
    city: string

    @ApiPropertyOptional({
        description: "Address street",
        example: "street name"
    })
    street: string

    @ApiPropertyOptional({
        description: "Address details",
        example: "13 - street name any where"
    })
    addressLine: string

    @ApiPropertyOptional({
        description: "user id",
        example: 1
    })
    userId: number
}