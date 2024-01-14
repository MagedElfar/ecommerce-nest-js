import { User } from 'src/core/decorators/user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { IUser } from '../users/users.interface';
import { QueryDto } from 'src/core/dto/query.dto';
import { OrdersQueryDto, UserOrdersQueryDto } from './dto/order-query.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';

@ApiTags("Orders")
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "create new order" })
    @ApiCreatedResponse({ type: OrderDto })
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

    @Put(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "update order" })
    @ApiParam({ name: "id", description: "order id" })
    @ApiOkResponse({ type: OrderDto })
    async update(
        @Body() updateOrderDto: UpdateOrderDto,
        @Param("id", ParseIntPipe) id: number
    ) {
        try {

            const orders = await this.ordersService.update(id, updateOrderDto)

            return orders
        } catch (error) {
            throw error
        }
    }

    @Get("")
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "Find all orders" })
    @ApiFindAllResponse(OrderDto)
    async getAll(
        @Query() ordersQueryDto: OrdersQueryDto,
    ) {
        try {

            const orders = await this.ordersService.findAll(ordersQueryDto)

            return orders
        } catch (error) {
            throw error
        }
    }

    @Get("user")
    @ApiOperation({ summary: "Find user orders" })
    @ApiFindAllResponse(OrderDto)
    async getUserOrder(
        @Query() ordersQueryDto: UserOrdersQueryDto,
        @User("id") userId: number,
    ) {
        try {

            ordersQueryDto.userId = userId
            const orders = await this.ordersService.findAll(ordersQueryDto)

            return orders
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @ApiOperation({ summary: "Find order by id" })
    @ApiParam({ name: "id", description: "order id" })
    async getOrder(
        @User() user: IUser,
        @Param("id", ParseIntPipe) id: number
    ) {
        try {

            const order = await this.ordersService.findOrder(id, user)

            return order
        } catch (error) {
            throw error
        }
    }
}
