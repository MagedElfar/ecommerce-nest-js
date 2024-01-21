import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { OrderItem } from './entities/order-item-entity';
import { IOrderItem } from './interfaces/order-item.interface';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrdersItemsService {
    constructor(
        @InjectModel(OrderItem)
        private readonly orderItemModel: typeof OrderItem,
        private readonly sequelize: Sequelize,
    ) { }

    async create(createOrderItemDto: CreateOrderItemDto, t?: Transaction): Promise<IOrderItem> {
        const transaction = t || await this.sequelize.transaction();
        try {

            const item = await this.orderItemModel.create(
                createOrderItemDto,
                { transaction }
            )

            if (!t) await transaction.commit();

            return item["dataValues"];
        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }
}
