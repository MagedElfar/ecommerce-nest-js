import { Module, Inject, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import configuration from './core/config/configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './users/user.entity';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { RolesGuard } from './core/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersImagesModule } from './users-images/users-images.module';
import { UserImages } from './users-images/users-images.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,

    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),

    // DatabaseModule,
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        models: [UserEntity, UserImages], // Add your models here
        logging: false,
        sync: {
          alter: true
        }
      }),
    }),
    AuthModule,
    LoggerModule,
    UsersModule,
    UsersImagesModule,
    CloudinaryModule,

  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    AppService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
