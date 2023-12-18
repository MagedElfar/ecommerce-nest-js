import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { AdminUsersService } from './users/admin-users.service';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [AdminUsersService],
})
export class AdminModule { }
