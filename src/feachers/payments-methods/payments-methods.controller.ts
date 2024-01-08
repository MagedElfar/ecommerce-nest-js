import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsMethodsService } from './payments-methods.service';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Payment Method")
@Controller('payments-methods')
export class PaymentsMethodsController {

    constructor(private readonly paymentsMethodsService: PaymentsMethodsService) { }

    @Get()
    async get() {
        try {

            const methods = await this.paymentsMethodsService.findAll()

            return { methods }
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        try {

            const method = await this.paymentsMethodsService.create(createPaymentMethodDto)

            return { method }
        } catch (error) {
            throw error
        }
    }
}
