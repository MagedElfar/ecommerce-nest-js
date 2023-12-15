import { LoggerService } from './../../logger/logger.service';
// global-exception.filter.ts
import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { error } from 'console';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    constructor(private loggerService: LoggerService) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let error = 'Internal Server Error';



        if (exception instanceof HttpException) {
            const exp = exception as any
            statusCode = exception.getStatus();
            message = exp.getResponse().message;
            error = exp.getResponse().error
        }

        // // Log the error using your logger service
        // this.logger.error(`[${request.method}] ${request.url}`, exception.stack, 'ExceptionFilter');


        this.loggerService.error(error, null, "", { error: message })
        response.status(statusCode).json({
            message: message,
            statusCode,
            error,
        });
    }
}
