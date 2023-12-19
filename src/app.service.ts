import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from './feachers/users/user.entity';
import { UserImages } from './feachers/users-images/users-images.entity';


@Injectable()
export class AppService {

  constructor(private sequelize: Sequelize) { }

  getHello(): string {
    return 'Hello World!';
  }

  // async onApplicationBootstrap() {
  //   // Add models and automatically create tables
  //   this.sequelize.addModels([
  //     User,
  //     UserImages
  //   ]);
  //   await this.sequelize.sync({ alter: true });
  // }
}
