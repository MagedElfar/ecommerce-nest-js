import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { CartItemDto } from "src/feachers/cart-items/dto/response/cartItem.dto";

export class CartDto extends BaseDto {
    @ApiProperty({
        description: "user id"
    })
    userId: number

    @ApiProperty({
        description: "cart items",
        isArray: true
    })
    items: CartItemDto
}