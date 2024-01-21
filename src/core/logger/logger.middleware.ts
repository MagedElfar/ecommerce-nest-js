// logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Log request information
    res.on("close", () => {

      const { statusCode, statusMessage } = res;
      if (res.statusCode >= 400) {

        this.loggerService.error({
          message: statusMessage,
          req,
          statusCode
        })
      } else {
        this.loggerService.info({
          message: statusMessage,
          req,
          statusCode
        })

      }
    });

    next();
  }
}



















