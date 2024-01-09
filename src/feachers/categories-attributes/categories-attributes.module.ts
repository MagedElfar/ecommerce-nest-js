import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesAttribute } from './categories-attributes.entity';
import { CategoriesAttributesController } from './categories-attributes.controller';
import { CategoriesAttributeService } from './categories-attributes.service';
import { CategoriesModule } from '../categories/categories.module';
import { AttributeValuesModule } from '../attributes-values/attributes-values.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CategoriesAttribute]),
    CategoriesModule,
    AttributeValuesModule
  ],
  controllers: [CategoriesAttributesController],
  providers: [CategoriesAttributeService],
})
export class CategoriesAttributesModule { }
