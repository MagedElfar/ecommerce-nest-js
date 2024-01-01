import { IsNotEmpty, IsString } from "class-validator";
import { PaymentMethod } from "src/core/constants";

export class CreatePaymentMethodDto {

    @IsNotEmpty()
    @IsString()
    name: string

}