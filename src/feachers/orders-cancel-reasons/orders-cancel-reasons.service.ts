import { Injectable } from '@nestjs/common';
import { CreateReasonDto } from './dto/create-reason.dto';
import { IOrderCancelReason } from './interfaces/order-cancel-reason.interface';
import { InjectModel } from '@nestjs/sequelize';
import { OrderCancelReason } from './entities/order-cancel-reason.entity';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class OrdersCancelReasonsService {

    constructor(
        @InjectModel(OrderCancelReason)
        private readonly reasonModel: typeof OrderCancelReason,
        private readonly sequelize: Sequelize
    ) { }

    async create(createReasonDto: CreateReasonDto, t?: Transaction): Promise<OrderCancelReason> {

        const transaction = t || await this.sequelize.transaction()

        try {
            const reason = await this.reasonModel.create(createReasonDto, { transaction });

            if (!t) await transaction.commit()
            return reason["dataValues"]
        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }
}
