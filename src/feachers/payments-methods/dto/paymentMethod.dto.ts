import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";

export class PaymentMethodDto extends BaseDto {
    @ApiProperty({
        description: "payment method name"
    })
    name: string
} 