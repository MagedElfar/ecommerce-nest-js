import { Module } from '@nestjs/common';
import { AttributeValuesService } from './attributes-values.service';
import { AttributeValuesController } from './attributes-values.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttributeValues } from './attributes-values.entity';

@Module({
  imports: [SequelizeModule.forFeature([AttributeValues])],
  providers: [AttributeValuesService],
  controllers: [AttributeValuesController],
  exports: [AttributeValuesService]
})
export class AttributeValuesModule { }
