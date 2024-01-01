import { IModel } from "src/core/interface/model.interface";
import { User } from "../users/user.entity";
import { IAddress } from "../addresses/address.interface";
import { IPhone } from "../phones/phone.interface";
import { IOrderItem } from "../orders-items/order-item.interface";
import { PaymentMethod } from "../payments-methods/payment-method.entity";

export interface IOrder extends IModel {

    orderNumber?: string;

    subTotal?: string;

    deliveredAt?: Date

    userId?: number

    user?: User

    addressId?: number

    address?: IAddress

    phoneId?: number

    phone?: IPhone

    paymentMethodId?: number

    paymentMethod?: PaymentMethod

    items?: IOrderItem[]
}