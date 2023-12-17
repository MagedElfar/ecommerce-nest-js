import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryProvider, CloudinaryService],

})
export class CloudinaryModule { }
