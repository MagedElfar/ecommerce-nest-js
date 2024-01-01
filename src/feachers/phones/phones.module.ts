import { Module } from '@nestjs/common';
import { PhonesController } from './phones.controller';
import { PhonesService } from './phones.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Phone } from './phone.entity';

@Module({
  imports: [SequelizeModule.forFeature([Phone])],
  controllers: [PhonesController],
  providers: [PhonesService],
  exports: [PhonesService]
})
export class PhonesModule { }
