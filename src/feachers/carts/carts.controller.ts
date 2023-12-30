import { Controller, Delete, Get } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    async create(
        @User("id") userId: number
    ) {
        try {
            const cart = await this.cartsService.findOne({ userId })

            return { cart }
        } catch (error) {
            throw error
        }
    }

    @Delete()
    async emptyCard(
        @User("id") userId: number
    ) {
        try {
            await this.cartsService.emptyCart(userId)

            return
        } catch (error) {
            throw error
        }
    }
}
