import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/feachers/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './services/password.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RestToken } from './entities/reset-token.entity';
import { MailModule } from 'src/utility/mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forFeature([RestToken]),
    PassportModule,
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.exp') },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PasswordService
  ],
})
export class AuthModule { }
