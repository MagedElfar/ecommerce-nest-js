import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubCategoriesService } from './sub-categories.service';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { SubCategory } from './sub-category.entity';
import { SubCategoriesController } from './sub-categories.controller';

@Module({
    imports: [SequelizeModule.forFeature([SubCategory]), CloudinaryModule],
    providers: [SubCategoriesService],
    controllers: [SubCategoriesController],
    exports: [SubCategoriesService]
})
export class SubCategoriesModule { }
