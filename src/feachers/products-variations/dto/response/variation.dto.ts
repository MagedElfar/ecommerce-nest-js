import { ApiProperty } from "@nestjs/swagger"
import { AttributeValueDto } from "src/feachers/attributes-values/dto/response/attributeValue.dto"
import { MediaDto } from "src/feachers/media/dto/media.dto"

export class VariationDto {

    @ApiProperty({
        description: "variation name",
        example: "variation name"
    })
    name: string

    @ApiProperty({
        description: "variation price",
        example: 10
    })
    price: number

    @ApiProperty({
        description: "variation ske",
        example: "SKU-EX-01"
    })
    sku: string

    @ApiProperty({
        description: "variation quantity",
        example: 10
    })
    quantity: number

    @ApiProperty({
        description: "product id",
        example: 1
    })
    productId: number

    @ApiProperty({
        description: "product variation images",
        isArray: true,
        type: MediaDto
    })
    images: MediaDto;

    @ApiProperty({
        description: "variation attributes",
        isArray: true,
        type: AttributeValueDto
    })
    attributes?: AttributeValueDto;
}