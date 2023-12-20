import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BrandImage } from './brands-image.entity';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { BrandImageService } from './brands-image.service';
import { BrandsModule } from '../brands/brands.module';
import { BrandsImageController } from './brands-image.controller';

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
