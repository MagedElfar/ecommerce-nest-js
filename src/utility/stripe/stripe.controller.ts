import { Public } from 'src/core/decorators/public.decorator';
import { StripeService } from './stripe.service';
import { Controller, HttpCode, HttpStatus, Post, RawBodyRequest, Req } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post("webhook")
    @Public()
    @HttpCode(HttpStatus.OK)
    async webhook(
        @Req() req: RawBodyRequest<Request>
    ) {
        try {

            await this.stripeService.webhookEvent(req);

            return
        } catch (error) {
            throw error
        }
    }
}
