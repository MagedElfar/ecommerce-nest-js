import { ApiProperty, PickType } from "@nestjs/swagger";
import { OrderStatus } from "src/core/constants";
import { BaseDto } from "src/core/dto/base-model.dto";
import { AddressDto } from "src/feachers/addresses/dto/address.dto";
import { OrderCancelReasonDto } from "src/feachers/orders-cancel-reasons/dto/camcel.dto";
import { OrderItemDto } from "src/feachers/orders-items/dto/orderItem.dto";
import { PaymentMethodDto } from "src/feachers/payments-methods/dto/paymentMethod.dto";
import { PaymentDto } from "src/feachers/payments/dto/payment.dto";
import { PhoneDto } from "src/feachers/phones/dto/phone.dto";
import { UserDto } from "src/feachers/users/dto/response/user.dto";

class UserOrder extends PickType(UserDto, ["id", "name", "email"]) { }

export class OrderDto extends BaseDto {
    @ApiProperty({
        description: "order number",
        uniqueItems: true
    })
    orderNumber: string;

    @ApiProperty({
        description: "order total",
    })
    total: number;

    @ApiProperty({
        description: "order sub total",
    })
    subTotal: number;

    @ApiProperty({
        description: "order delivered date",
    })
    deliveredAt: string

    @ApiProperty({
        description: "order status",
        enum: OrderStatus
    })
    status: OrderStatus

    @ApiProperty({
        description: "user id",
    })
    userId: number

    @ApiProperty({
        description: "user",
    })
    user: UserOrder

    @ApiProperty({
        description: "address id",
    })
    addressId: number

    @ApiProperty({
        description: "address",
    })
    address: AddressDto

    @ApiProperty({
        description: "phone id",
    })
    phoneId: number

    @ApiProperty({
        description: "phone",
    })
    phone: PhoneDto

    @ApiProperty({
        description: "paymentMethodId",
    })
    paymentMethodId: number

    @ApiProperty({
        description: "paymentMethod",
    })
    paymentMethod: PaymentMethodDto

    @ApiProperty({
        description: "payment process details",
    })
    payment: PaymentDto

    @ApiProperty({
        description: "order Items",
        isArray: true
    })
    items: OrderItemDto[]

    @ApiProperty({
        description: "cancel order reason",
        isArray: true
    })
    cancelReasons: OrderCancelReasonDto[]
}