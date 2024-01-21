import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { VariationDto } from "src/feachers/products-variations/dto/variation.dto";
import { ProductDto } from "src/feachers/products/dto/product.dto";

class ProductCartDto extends PickType(ProductDto, ["id", "name", "price"]) { }


class OrderVariant extends OmitType(VariationDto, ["attributes", "images"]) {

    @ApiProperty({
        description: "product"
    })
    product: ProductCartDto
}

export class OrderItemDto extends BaseDto {


    @ApiProperty({
        description: "quantity"
    })
    quantity: number

    @ApiProperty({
        description: "order id"
    })
    orderId: number

    @ApiProperty({
        description: "product variant id"
    })
    variantId: number

    // @ApiProperty({
    //     description: "product variant"
    // })
    // variant: OrderVariant;
}