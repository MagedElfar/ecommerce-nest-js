import { CheckoutService } from './checkout.service';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { User } from 'src/core/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags("checkout")
@ApiBearerAuth()
@Controller('checkout')
export class CheckoutController {

    constructor(private readonly checkoutService: CheckoutService) { }

    @Post()
    @ApiOperation({ summary: "palace order" })
    async checkout(
        @Body() checkoutDto: CheckoutDto,
        @User("id") userId: number
    ) {
        try {

            checkoutDto.userId = userId
            const session = await this.checkoutService.checkout(checkoutDto)

            return session
        } catch (error) {
            throw error
        }
    }

    @Post(":orderId")
    @ApiParam({ name: "id", description: "order id" })
    @ApiOperation({ summary: "place specific order" })
    async checkoutOrder(
        @Param("orderId") orderId: number
    ) {
        try {

            const session = await this.checkoutService.checkoutOrder(orderId)

            return { session }
        } catch (error) {
            throw error
        }
    }
}
