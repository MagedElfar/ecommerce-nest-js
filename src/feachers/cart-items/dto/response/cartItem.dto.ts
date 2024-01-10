import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { MediaDto } from "src/feachers/media/dto/media.dto";
import { VariationDto } from "src/feachers/products-variations/dto/response/variation.dto";
import { ProductDto } from "src/feachers/products/dto/response/product.dto";

class ProductCartDto extends PickType(ProductDto, ["id", "name", "price"]) { }

class VariantMedia extends PickType(MediaDto, ["url"]) { }

class CartVariant extends OmitType(VariationDto, ["attributes", "images"]) {

    @ApiProperty({
        description: "variant images",
        isArray: true
    })
    images: VariantMedia;

    @ApiProperty({
        description: "product"
    })
    product: ProductCartDto
}

export class CartItemDto extends BaseDto {
    @ApiProperty({
        description: "item total price (variantItem * quantity)"
    })
    total: number

    @ApiProperty({
        description: "quantity"
    })
    quantity: number

    @ApiProperty({
        description: "user cart id"
    })
    cartId: number

    @ApiProperty({
        description: "product variant id"
    })
    variantId: number

    @ApiProperty({
        description: "product variant"
    })
    variant: CartVariant;
}