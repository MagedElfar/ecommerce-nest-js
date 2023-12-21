import { Module } from '@nestjs/common';
import { AttributeValuesService } from './attribute-values.service';
import { AttributeValuesController } from './attribute-values.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttributeValues } from './attribute-values.entity';

@Module({
  imports: [SequelizeModule.forFeature([AttributeValues])],
  providers: [AttributeValuesService],
  controllers: [AttributeValuesController],
  exports: [AttributeValuesService]
})
export class AttributeValuesModule { }
