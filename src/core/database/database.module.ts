// database.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { models } from './models';
import { Dialect } from 'sequelize';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                dialect: configService.get<Dialect>('database.dialect'),
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                username: configService.get<string>('database.username'),
                password: configService.get<string>('database.password'),
                database: configService.get<string>('database.database'),
                models,
                retryAttempts: 1,
                logging: false,
                sync: {
                    alter: false,
                    force: false
                },
                autoLoadModels: true,
                migrations: ["src/core/database/migrations"]
            }),
        }),
    ],
    exports: [SequelizeModule],
})
export class DatabaseModule { }
