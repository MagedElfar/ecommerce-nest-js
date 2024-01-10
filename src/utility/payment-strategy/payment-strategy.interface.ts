import { IOrder } from "src/feachers/orders/order-interface";

export interface PaymentStrategy {
    pay(order: IOrder): Promise<any>; // Adjust return type as needed
}
