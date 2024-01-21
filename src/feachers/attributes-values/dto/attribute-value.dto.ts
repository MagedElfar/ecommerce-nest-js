import { ApiProperty, PickType } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class AttributeValueDto extends BaseDto {

    @ApiProperty({
        description: "attribute value",
        example: "red"
    })
    value: string;

    @ApiProperty({
        description: "attribute ID",
        example: 1
    })
    attributeId: number
}

export class AttributeValueWithTotalDto extends PickType(AttributeValueDto, ["id", "value"]) {
    @ApiProperty({
        description: "total products belong to the attribute value",
        example: 1
    })
    totalProducts: number
}