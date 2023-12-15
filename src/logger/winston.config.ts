import * as winston from 'winston';
import 'winston-daily-rotate-file';

const transports = [];

// Create and export the logger instance
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});