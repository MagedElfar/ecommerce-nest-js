import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsMethodsService } from './payments-methods.service';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFindAllResponse } from 'src/core/decorators/api-find-all-response.decorator';
import { PaymentMethodDto } from './dto/paymentMethod.dto';

@ApiTags("Payment Method")
@ApiBearerAuth()
@Controller('payments-methods')
export class PaymentsMethodsController {

    constructor(private readonly paymentsMethodsService: PaymentsMethodsService) { }

    @Get()
    @ApiOperation({ summary: "Find all payment methods" })
    @ApiFindAllResponse(PaymentMethodDto)
    async get() {
        try {

            const methods = await this.paymentsMethodsService.findAll()

            return methods
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: "create payment method",
        description: `Role Required: ${UserRole.ADMIN}`
    })
    @ApiCreatedResponse({ type: PaymentMethodDto })
    async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        try {

            const method = await this.paymentsMethodsService.create(createPaymentMethodDto)

            return { method }
        } catch (error) {
            throw error
        }
    }
}
