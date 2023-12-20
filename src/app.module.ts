import { Module, Inject, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './feachers/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './feachers/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './feachers/auth/jwt-auth.guard';
import configuration from './core/config/configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from './core/logger/logger.module';
import { LoggerMiddleware } from './core/logger/logger.middleware';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { RolesGuard } from './core/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersImagesModule } from './feachers/users-images/users-images.module';
import { CloudinaryModule } from './utility/cloudinary/cloudinary.module';
import { AdminModule } from './feachers/admin/admin.module';
import { CategoriesModule } from './feachers/categories/categories.module';
import { CategoryImageModule } from './feachers/category-image/category-image.module';
import { models } from './core/database/models';
import { ProfilesModule } from './feachers/profiles/profiles.module';
import { BrandsModule } from './feachers/brands/brands.module';
import { BrandsImageModule } from './feachers/brands-image/brands-image.module';
import { ProductsModule } from './feachers/products/products.module';
import { AttributesModule } from './feachers/attributes/attributes.module';
import { AttributeValuesModule } from './feachers/attribute-values/attribute-values.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 3,

    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),

    // DatabaseModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        models, // Add your models here
        logging: false,
        sync: {
          alter: true,
          // force: true
        },
        autoLoadModels: true
      }),
    }),
    LoggerModule,
    CloudinaryModule,
    AuthModule,
    UsersModule,
    UsersImagesModule,
    AdminModule,
    CategoriesModule,
    CategoryImageModule,
    ProfilesModule,
    BrandsModule,
    BrandsImageModule,
    ProductsModule,
    AttributesModule,
    AttributeValuesModule
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
