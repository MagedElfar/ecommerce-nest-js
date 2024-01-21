import { PaymentStatus } from "src/core/constants";
import { IModel } from "src/core/interface/model.interface";
import { PaymentMethod } from "../payments-methods/entities/payment-method.entity";

export interface IPayment extends IModel {

    paymentAmount?: number

    chargeId?: string;

    cardNumber?: string;

    cardExpiry?: string;

    paymentStatus?: PaymentStatus

    paymentMethodId?: number

    paymentMethod?: PaymentMethod

    orderId?: number

    order?: any
}