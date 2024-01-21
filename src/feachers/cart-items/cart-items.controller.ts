import { CartItemsService } from './cart-items.service';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { CreateItemDto } from './dto/create-item-dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CartItemDto } from './dto/cartItem.dto';

@ApiTags("Carts")
@ApiBearerAuth()
@Controller('carts/items')
export class CartItemsController {

    constructor(private readonly cartItemsService: CartItemsService) { }

    @Post()
    @ApiOperation({ summary: "add new item to cart" })
    @ApiOkResponse({ type: CartItemDto })
    async create(
        @Body() createItemDto: CreateItemDto,
        @User("id") userId: number
    ) {
        try {
            const item = await this.cartItemsService.create({
                ...createItemDto,
                userId
            })

            return item
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @ApiOperation({ summary: "updated cart item" })
    @ApiParam({ name: "id", description: "cart item id" })
    @ApiOkResponse({ type: CartItemDto })
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

            return item
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: "remove item from cart" })
    @ApiParam({ name: "id", description: "cart item id" })
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
