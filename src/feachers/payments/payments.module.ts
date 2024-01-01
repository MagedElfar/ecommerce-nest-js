import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [SequelizeModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule { }
