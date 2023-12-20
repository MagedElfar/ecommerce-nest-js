import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Brand } from './brands.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';

@Module({
    imports: [SequelizeModule.forFeature([Brand]), CloudinaryModule],
    providers: [BrandsService],
    controllers: [BrandsController],
    exports: [BrandsService]
})
export class BrandsModule { }
