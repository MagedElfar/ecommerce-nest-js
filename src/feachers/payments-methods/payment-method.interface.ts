import { IModel } from "src/core/interface/model.interface";
import { PaymentMethod } from "src/core/constants";

export interface IPaymentMethod extends IModel {
    name?: string
}