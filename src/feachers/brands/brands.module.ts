import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Brand } from './brands.entity';
import { BrandsService } from './services/brands.service';
import { BrandsController } from './controlers/brands.controller';
import { BrandsImageController } from './controlers/brands-images.controller';
import { BrandsImageService } from './services/brands-images.service';
import { MediaModule } from '../media/media.module';

@Module({
    imports: [SequelizeModule.forFeature([Brand]), MediaModule],
    providers: [BrandsService, BrandsImageService],
    controllers: [BrandsController, BrandsImageController],
    exports: [BrandsService]
})
export class BrandsModule { }
