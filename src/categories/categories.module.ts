import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './category.entity';

@Module({
    imports: [SequelizeModule.forFeature([Category])]
})
export class CategoriesModule { }
