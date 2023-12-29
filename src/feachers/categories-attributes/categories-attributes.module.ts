import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesAttribute } from './categories-attributes.entity';
import { CategoriesAttributesController } from './categories-attributes.controller';
import { CategoriesAttributeService } from './categories-attributes.service';

@Module({
  imports: [
    SequelizeModule.forFeature([CategoriesAttribute]),
  ],
  controllers: [CategoriesAttributesController],
  providers: [CategoriesAttributeService],
})
export class CategoriesAttributesModule { }
