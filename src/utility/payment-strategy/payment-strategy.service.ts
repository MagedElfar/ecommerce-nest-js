import { PaymentStrategyFactory } from './payment.factory';
import { Inject, Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { IOrder } from 'src/feachers/orders/interfaces/order.interface';

@Injectable()
export class PaymentStrategyService {
    constructor(private readonly paymentStrategyFactory: PaymentStrategyFactory) { }

    async processPayment(strategyName: string, order: IOrder): Promise<any> {
        try {
            const strategy = this.paymentStrategyFactory.create(strategyName);

            return strategy.pay(order);
        } catch (error) {
            error
        }
    }

}
