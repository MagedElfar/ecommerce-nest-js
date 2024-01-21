import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './entities/address.entity';
import { InjectUserInterceptor } from 'src/core/interceptors/inject-user.interceptor';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService]
})
export class AddressesModule { }
