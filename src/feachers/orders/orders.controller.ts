import { User } from 'src/core/decorators/user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IUser } from '../users/users.interface';
import { OrdersQueryDto, UserOrdersQueryDto } from './dto/order-query.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';
import { ApiFindAllResponse } from 'src/core/decorators/api-find-all-response.decorator';
import { Permissions } from 'src/core/decorators/permissions.decorator';
import { OwnerShipGuard } from 'src/core/guards/owner-ship.guard';
import { OrderScope } from './entities/order.entity';

@ApiTags("Orders")
@ApiBearerAuth()
@Controller('orders')
@Permissions(OrdersService)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "create new order",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({ type: OrderDto })
    async create(
        @Body() createOrderDto: CreateOrderDto,
    ) {
        try {

            const order = await this.ordersService.create(createOrderDto)

            return order
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "update order",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
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
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "Find all orders",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
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
    @ApiOperation({
        summary: "Find order by id",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: get order for any user
        ${UserRole.CUSTOMER}: get own order only
        `
    })
    @ApiParam({ name: "id", description: "order id" })
    @UseGuards(OwnerShipGuard)
    async getOrder(
        @User() user: IUser,
        @Param("id", ParseIntPipe) id: number
    ) {
        try {

            const order = await this.ordersService.findOneById(id, Object.values(OrderScope))

            if (!order) throw new NotFoundException("order not found")
            return order
        } catch (error) {
            throw error
        }
    }
}
