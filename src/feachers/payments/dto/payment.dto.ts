import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus } from "src/core/constants";
import { BaseDto } from "src/core/dto/base-model.dto";

export class PaymentDto extends BaseDto {
    @ApiProperty({
        description: "total amount paid"
    })
    paymentAmount: number;

    @ApiProperty({
        description: "payment charge id"
    })
    chargeId: string;

    @ApiProperty({
        description: "payment status",
        enum: PaymentStatus
    })
    paymentStatus: PaymentStatus
}