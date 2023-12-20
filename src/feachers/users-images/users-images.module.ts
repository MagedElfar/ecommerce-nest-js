import { CloudinaryModule } from '../../utility/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { UsersImagesController } from './users-images.controller';
import { UsersImagesService } from './users-images.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserImages } from './users-images.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserImages]),
    CloudinaryModule,
    UsersModule
  ],
  controllers: [UsersImagesController],
  providers: [UsersImagesService]
})
export class UsersImagesModule { }
