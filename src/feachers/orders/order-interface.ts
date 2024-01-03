import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";
import { IAddress } from "../addresses/address.interface";
import { IPhone } from "../phones/phone.interface";
import { IOrderItem } from "../orders-items/order-item.interface";
import { PaymentMethod } from "../payments-methods/payment-method.entity";
import { IOrderCancelReason } from "../orders-cancel-reasons/order-cancel-reason.interface";
import { IPaymentMethod } from "../payments-methods/payment-method.interface";

export interface IOrder extends IModel {

    orderNumber?: string;

    total?: number;

    subTotal?: number;

    deliveredAt?: string

    userId?: number

    user?: User

    addressId?: number

    address?: IAddress

    phoneId?: number

    phone?: IPhone

    paymentMethodId?: number

    paymentMethod?: IPaymentMethod

    items?: IOrderItem[]

    cancelReasons?: IOrderCancelReason[]
}