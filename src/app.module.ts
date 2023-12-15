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
import { User } from './users/user.entity';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';

@Module({
  imports: [
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
        models: [User], // Add your models here
        sync: {
          alter: true
        }
      }),
    }),
    UsersModule,
    AuthModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
