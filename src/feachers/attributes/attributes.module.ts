import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attribute } from './attribute.entity';

@Module({
  imports: [SequelizeModule.forFeature([Attribute])],
  controllers: [AttributesController],
  providers: [AttributesService]
})
export class AttributesModule { }
