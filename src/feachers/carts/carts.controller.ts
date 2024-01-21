import { Controller, Delete, Get } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { CartsService } from './carts.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartDto } from './dto/cart.dto';
import { CartScop } from './entities/carts.entity';

@ApiTags("Carts")
@ApiBearerAuth()
@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    @ApiOperation({ summary: "get user cart" })
    @ApiOkResponse({ type: CartDto })
    async find(
        @User("id") userId: number
    ) {
        try {
            const cart = await this.cartsService.findOne({ userId }, [CartScop.WITH_ITEMS])
            return cart
        } catch (error) {
            throw error
        }
    }

    @Delete()
    @ApiOperation({ summary: "empty user cart items" })
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
