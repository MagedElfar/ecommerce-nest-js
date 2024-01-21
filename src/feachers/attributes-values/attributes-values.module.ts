import { Module } from '@nestjs/common';
import { AttributeValuesService } from './attributes-values.service';
import { AttributeValuesController } from './attributes-values.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttributeValue } from './entities/attribute-value.entity';

@Module({
  imports: [SequelizeModule.forFeature([AttributeValue])],
  providers: [AttributeValuesService],
  controllers: [AttributeValuesController],
  exports: [AttributeValuesService]
})
export class AttributeValuesModule { }
