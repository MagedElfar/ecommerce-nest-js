import { CartItemsService } from './cart-items.service';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { CreateItemDto } from './dto/create-item-dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('cart-items')
export class CartItemsController {

    constructor(private readonly cartItemsService: CartItemsService) { }

    @Post()
    async create(
        @Body() createItemDto: CreateItemDto,
        @User("id") userId: number
    ) {
        try {
            const item = await this.cartItemsService.create({
                ...createItemDto,
                userId
            })

            return { item }
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateItemDto: UpdateItemDto,
        @User("id") userId: number
    ) {
        try {
            const item = await this.cartItemsService.updated(id, {
                ...updateItemDto,
                userId
            })

            return { item }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    async delete(
        @Param("id", ParseIntPipe) id: number,
        @User("id") userId: number
    ) {
        try {

            await this.cartItemsService.delete(id, userId)

            return
        } catch (error) {
            throw error
        }
    }
}
