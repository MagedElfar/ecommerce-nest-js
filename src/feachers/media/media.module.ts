import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from './entities/media.entity';
import { CloudinaryModule } from 'src/utility/cloudinary/cloudinary.module';
import { MediaRepository } from './media.repository';
import { MediaHelper } from './media.helper';

@Module({
  imports: [
    SequelizeModule.forFeature([Media]),
    CloudinaryModule
  ],
  providers: [MediaService, MediaRepository, MediaHelper],
  controllers: [MediaController],
  exports: [MediaService]
})
export class MediaModule { }
