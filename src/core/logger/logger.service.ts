import { createLogger, transports, format, Logger as WinstonLogger } from 'winston';
import { Request } from 'express';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LoggerDto } from './dto/logger.dto';

const logsDir = join(dirname(__dirname), '..', "..", 'logs');


if (!existsSync(logsDir)) {
    mkdirSync(logsDir);
}

export class LoggerService {
    private logger: WinstonLogger;

    constructor() {
        // Define the format for the console transport (with colorization)
        const consoleFormat = format.combine(
            format.colorize({
                all: true,
                colors: {
                    info: "blue",
                }
            }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message, data }) => {
                const endpoint = data && data.endpoint ? ` [${data.endpoint}]` : '';
                const method = data && data.method ? ` ${data.method}` : '';
                const statusCode = data && data.statusCode ? ` ${data.statusCode}` : '';
                const logData = data && data.logData ? ` ${JSON.stringify(data.logData, null, 2).replace(/\\n/g, '\n')}` : '';
                // return `[${timestamp}] ${level}:${endpoint} ${message}${logData}`;
                return `[${timestamp}] ${level}:${endpoint}${method} ${statusCode} ${message}${logData}`;
            })
        );

        // Define the format for the file transports (without colorization)
        const fileFormat = format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message, data }) => {
                const endpoint = data && data.endpoint ? ` [${data.endpoint}]` : '';
                const method = data && data.method ? ` ${data.method}` : '';
                const statusCode = data && data.statusCode ? ` ${data.statusCode}` : '';
                const logData = data && data.logData ? ` ${JSON.stringify(data.logData, null, 2).replace(/\\n/g, '\n')}` : '';                // return `[${timestamp}] ${level}:${endpoint} ${message}${logData}`;
                return `[${timestamp}] ${level}:${endpoint}${method} ${statusCode} ${message}${logData}`;

            })
        );

        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.splat(),
                format.json()
            ),
            // defaultMeta: { service: 'your-service-name' },
            transports: [
                // Use the consoleFormat for the Console transport
                new transports.Console({
                    format: consoleFormat
                }),
                new DailyRotateFile({
                    filename: join(logsDir, 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    format: fileFormat // Use the fileFormat for file transports
                }),
                new DailyRotateFile({
                    filename: join(logsDir, 'logs-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    format: fileFormat // Use the fileFormat for file transports
                }),
            ],
        });
    }

    public info(loggerDto: LoggerDto) {
        const { req = null, statusCode = "", logData, message } = loggerDto;
        const data = req ? { endpoint: req.originalUrl, logData, statusCode } : { logData };
        this.logger.info(message, { data });
    }

    public error(loggerDto: LoggerDto) {

        const { req = null, statusCode = "", logData: errorData, message } = loggerDto;

        const data = req ? {
            endpoint: req.originalUrl,
            logData: errorData ? errorData : "",
            method: req.method,
            statusCode
        } : { logData: errorData ? errorData : "" };
        this.logger.error(message, { data });
    }
}
