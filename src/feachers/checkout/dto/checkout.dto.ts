import { CreateOrderItemDto } from 'src/feachers/orders-items/dto/create-order-item.dto';
import { OmitType } from "@nestjs/mapped-types";
import { CreateOrderDto } from "src/feachers/orders/dto/create-order.dto";
import { IOrderItem } from 'src/feachers/orders-items/order-item.interface';

export class CheckoutDto extends OmitType(CreateOrderDto, ['userId', "items"]) {
    userId: number
    items: CreateOrderItemDto[]
} 