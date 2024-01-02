import { CreatePaymentDto } from './dto/create-payment.dto';
import { Injectable } from '@nestjs/common';
import { Payment } from './payment.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IPayment } from './payment.interface';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(Payment)
        private readonly paymentModel: typeof Payment
    ) { }

    async create(createPaymentDto: CreatePaymentDto): Promise<IPayment> {
        try {
            const payment = await this.paymentModel.create(createPaymentDto)

            return payment["dataValues"]
        } catch (error) {
            throw error
        }
    }
}
