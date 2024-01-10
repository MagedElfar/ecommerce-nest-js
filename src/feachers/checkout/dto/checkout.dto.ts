import { CreateOrderItemDto } from 'src/feachers/orders-items/dto/create-order-item.dto';
import { OmitType } from "@nestjs/swagger";
import { CreateOrderDto } from "src/feachers/orders/dto/create-order.dto";

export class CheckoutDto extends OmitType(CreateOrderDto, ['userId', "items", "status"]) {
    userId: number
    items: CreateOrderItemDto[]
} 