import { IsInt, IsNotEmpty } from "class-validator";
import { PaymentStatus } from "src/core/constants";
import { CreateOrderDto } from "src/feachers/orders/dto/create-order.dto";

export class CreatePaymentDto {
    paymentAmount: number

    chargeId: string;

    paymentStatus: PaymentStatus

    paymentMethodId: number

    orderId: number

}