import { Inject, Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { IOrder } from 'src/feachers/orders/interfaces/order.interface';

@Injectable()
export class PaymentStrategyService {
    constructor(@Inject('PaymentStrategy') private readonly paymentStrategies: Record<string, PaymentStrategy>) { }

    async processPayment(strategyName: string, order: IOrder): Promise<any> {
        try {
            const strategy = this.paymentStrategies[strategyName];

            if (!strategy) {
                throw new Error(`Payment strategy '${strategyName}' not found.`);
            }

            return strategy.pay(order);
        } catch (error) {
            error
        }
    }

}
