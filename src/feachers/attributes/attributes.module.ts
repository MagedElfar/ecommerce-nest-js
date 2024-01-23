import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attribute } from './entities/attribute.entity';
import { AttributeRepository } from './attributes.repository';

@Module({
  imports: [SequelizeModule.forFeature([Attribute])],
  controllers: [AttributesController],
  providers: [AttributesService, AttributeRepository]
})
export class AttributesModule { }
