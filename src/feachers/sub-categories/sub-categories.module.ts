import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubCategoriesService } from './services/sub-categories.service';
import { SubCategory } from './sub-categories.entity';
import { SubCategoriesController } from './controllers/sub-categories.controller';
import { MediaModule } from '../media/media.module';
import { SubCategoryImageController } from './controllers/sub-categories-images.controller';
import { SubCategoryImageService } from './services/sub-categories-images.service';

@Module({
    imports: [SequelizeModule.forFeature([SubCategory]), MediaModule],
    providers: [SubCategoriesService, SubCategoryImageService],
    controllers: [SubCategoriesController, SubCategoryImageController],
    exports: [SubCategoriesService]
})
export class SubCategoriesModule { }
