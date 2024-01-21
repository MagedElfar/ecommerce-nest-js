import { IModel } from "src/core/interface/model.interface";

export interface IOrderItem extends IModel {

    quantity?: number

    orderId?: number

    variantId?: number

    variant?: any;

}
