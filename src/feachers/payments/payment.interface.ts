import { PaymentStatus } from "src/core/constants";
import { IModel } from "src/core/interface/model.interface";
import { PaymentMethod } from "../payments-methods/payment-method.entity";
import { Order } from "../orders/order.entity";

export interface IPayment extends IModel {

    paymentAmount?: number

    chargeId?: string;

    cardNumber?: string;

    cardExpiry?: string;

    paymentStatus?: PaymentStatus

    paymentMethodId?: number

    paymentMethod?: PaymentMethod

    orderId?: number

    order?: Order
}