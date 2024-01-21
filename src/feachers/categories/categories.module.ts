import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './entities/categories.entity';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { MediaModule } from '../media/media.module';
import { CategoryImageService } from './services/categories-images.service';
import { CategoryImageController } from './controllers/categories-images.controller';

@Module({
    imports: [
        SequelizeModule.forFeature([Category]),
        MediaModule,
    ],
    providers: [
        CategoriesService,
        CategoryImageService
    ],
    controllers: [
        CategoriesController,
        CategoryImageController
    ],
    exports: [CategoriesService]
})
export class CategoriesModule { }
