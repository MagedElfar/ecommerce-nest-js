import { User } from 'src/core/decorators/user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async create(
        @Body() createOrderDto: CreateOrderDto,
        @User("id") userId: number
    ) {
        try {
            createOrderDto.userId = userId
            const order = await this.ordersService.create(createOrderDto)

            return { order }
        } catch (error) {
            throw error
        }
    }
}
