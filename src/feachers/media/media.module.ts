import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from './entities/media.entity';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Media]),
    CloudinaryModule
  ],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService]
})
export class MediaModule { }
