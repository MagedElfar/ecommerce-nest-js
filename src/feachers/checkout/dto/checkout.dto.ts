import { IsInt, IsNotEmpty } from "class-validator";
import { CreateOrderDto } from "src/feachers/orders/dto/create-order.dto";

export class CheckoutDto extends CreateOrderDto { }