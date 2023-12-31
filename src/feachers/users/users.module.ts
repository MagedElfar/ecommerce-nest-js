import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UsersImagesController } from './controllers/users-images.controller';
import { UsersImagesService } from './services/users-images.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    MediaModule
  ],
  controllers: [UsersController, UsersImagesController],
  providers: [UsersService, UsersImagesService],
  exports: [UsersService]
})
export class UsersModule { }
