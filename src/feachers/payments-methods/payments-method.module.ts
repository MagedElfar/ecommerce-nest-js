import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentsMethodsController } from './payments-methods.controller';
import { PaymentsMethodsService } from './payments-methods.service';

@Module({
  imports: [SequelizeModule.forFeature([PaymentMethod])],
  controllers: [PaymentsMethodsController],
  providers: [PaymentsMethodsService],
  exports: [PaymentsMethodsService]
})
export class PaymentsMethodsModule { }
