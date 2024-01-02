import { IModel } from 'src/core/interface/model.interface';
export interface IOrderCancelReason extends IModel {
    reason?: string

    orderId?: number
}