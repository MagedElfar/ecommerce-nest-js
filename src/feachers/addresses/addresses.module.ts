import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './entities/address.entity';
import { AddressRepository } from './address.repository';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  controllers: [AddressesController],
  providers: [AddressesService, AddressRepository],
  exports: [AddressesService]
})
export class AddressesModule { }
