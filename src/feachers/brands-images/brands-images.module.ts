import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandImage } from './brands-images.entity';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { BrandImageService } from './brands-images.service';
import { BrandsModule } from '../brands/brands.module';
import { BrandsImageController } from './brands-images.controller';

@Module({
  imports: [
    BrandsModule,
    SequelizeModule.forFeature([BrandImage]),
    CloudinaryModule,
  ],
  controllers: [BrandsImageController],
  providers: [BrandImageService],
  exports: [BrandImageService]
})
export class BrandsImageModule { }
