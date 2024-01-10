import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PaymentMethod } from "src/core/constants";

export class CreatePaymentMethodDto {

    @ApiProperty({
        description: "payment method name"
    })
    @IsNotEmpty()
    @IsString()
    name: string

}