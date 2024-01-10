import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PaymentMethod } from './payment-method.entity';
import { IPaymentMethod } from './payment-method.interface';

@Injectable()
export class PaymentsMethodsService {
    constructor(
        @InjectModel(PaymentMethod)
        private readonly paymentMethodModel: typeof PaymentMethod,
    ) { }

    async create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<IPaymentMethod> {
        try {

            const paymentMethod = await this.paymentMethodModel.create(createPaymentMethodDto)

            return paymentMethod["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {

            const isDeleted = await this.paymentMethodModel.destroy({ where: { id } })

            if (!isDeleted) throw new NotFoundException()
            return
        } catch (error) {
            throw error
        }
    }
    async findOne(data: Partial<IPaymentMethod>): Promise<IPaymentMethod> {
        try {

            const paymentMethod = await this.paymentMethodModel.findOne({ where: data })
            return paymentMethod["dataValues"];

        } catch (error) {
            throw error
        }
    }

    async findOdeById(id: number): Promise<IPaymentMethod | null> {
        try {

            const paymentMethod = await this.paymentMethodModel.findByPk(id)

            if (!paymentMethod) return null

            return paymentMethod["dataValues"];

        } catch (error) {
            throw error
        }
    }

    async findAll(): Promise<IPaymentMethod[]> {
        try {

            const paymentMethods = await this.paymentMethodModel.findAll();

            return paymentMethods.map(method => method["dataValues"]);

        } catch (error) {
            throw error
        }
    }
}
