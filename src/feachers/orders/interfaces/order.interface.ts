import { IModel } from "src/core/interface/model.interface";
import { IOrderItem } from "src/feachers/orders-items/interfaces/order-item.interface";

export interface IOrder extends IModel {

    orderNumber?: string;

    total?: number;

    subTotal?: number;

    deliveredAt?: string

    userId?: number

    addressId?: number

    phoneId?: number

    paymentMethodId?: number

    items?: IOrderItem[]
}
