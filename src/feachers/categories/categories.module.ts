import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';

@Module({
    imports: [SequelizeModule.forFeature([Category]), CloudinaryModule],
    providers: [CategoriesService],
    controllers: [CategoriesController],
    exports: [CategoriesService]
})
export class CategoriesModule { }
