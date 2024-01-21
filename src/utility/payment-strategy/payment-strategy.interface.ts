import { Order } from "src/feachers/orders/entities/order.entity";
import { IOrder } from "src/feachers/orders/interfaces/order.interface";

export interface PaymentStrategy {
    pay(order: IOrder): Promise<any>; // Adjust return type as needed
}
