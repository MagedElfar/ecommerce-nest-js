import { Module } from '@nestjs/common';
import { OrdersItemsService } from './orders-items.service';
import { OrdersItemsController } from './orders-items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItem } from './order-item-entity';

@Module({
  imports: [SequelizeModule.forFeature([OrderItem])],
  providers: [OrdersItemsService],
  exports: [OrdersItemsService],
  controllers: [OrdersItemsController]
})
export class OrdersItemsModule { }
