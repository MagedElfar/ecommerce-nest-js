import { LoggerService } from '../logger/logger.service';
import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

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

            console.log(exp)
            statusCode = exception.getStatus();
            message = exp.getResponse().message || exp.response;
            error = exp.getResponse().error
        }

        // // Log the error using your logger service
        // this.logger.error(`[${request.method}] ${request.url}`, exception.stack, 'ExceptionFilter');


        this.loggerService.error({
            message: error,
            logData: { error: message }
        })
        response.status(statusCode).json({
            message: message,
            statusCode,
            error,
        });
    }
}


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        console.log(ctx)
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}