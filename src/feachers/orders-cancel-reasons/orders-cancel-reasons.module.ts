import { Module } from '@nestjs/common';
import { OrdersCancelReasonsController } from './orders-cancel-reasons.controller';
import { OrdersCancelReasonsService } from './orders-cancel-reasons.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderCancelReason } from './order-cancel-reason.entity';

@Module({
  imports: [SequelizeModule.forFeature([OrderCancelReason])],
  controllers: [OrdersCancelReasonsController],
  providers: [OrdersCancelReasonsService],
  exports: [OrdersCancelReasonsService],
})
export class OrdersCancelReasonsModule { }
