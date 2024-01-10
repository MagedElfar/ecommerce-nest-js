import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class OrderCancelReasonDto extends BaseDto {

    @ApiProperty({
        description: "cancel order reason"
    })
    reason: string

    @ApiProperty({
        description: "order id"
    })
    orderId: number

}