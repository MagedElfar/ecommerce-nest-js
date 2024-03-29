import { LoggerService } from '../logger/logger.service';
import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    constructor(private loggerService: LoggerService) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let error: any = 'Internal Server Error';


        console.log("exception = ", exception)


        if (exception instanceof HttpException) {
            const exp = exception as any

            statusCode = exception.getStatus();
            message = exp.getResponse().message || exp.response;
            error = exp.getResponse().error
        }


        if (
            exception["parent"] && exception["parent"]["code"] === 'ER_DUP_ENTRY'
        ) {
            console.log(exception["parent"])
            statusCode = HttpStatus.CONFLICT
            message = exception["parent"]["sqlMessage"];
            // message = 'Duplicate entry error: This record already exists.';
            error = "Conflict"
        } else if (exception["parent"] && exception["parent"]["code"] === "23505") {
            statusCode = HttpStatus.CONFLICT
            message = exception["parent"]["detail"];
        } else if (
            exception["parent"] && exception["parent"]["code"] === 'ER_NO_REFERENCED_ROW_2'
        ) {
            console.log(exception["parent"])
            statusCode = HttpStatus.BAD_REQUEST
            message = exception["parent"]["sqlMessage"];
            // message = 'Foreign key constraint error: Referenced record not found.';
            error = "Bad Request"
        } else if (exception["parent"] && exception["parent"]["code"] === "23503") {
            statusCode = HttpStatus.NOT_FOUND
            message = exception["parent"]["detail"];
        } else if (exception["parent"]) {
            console.log(exception["parent"])
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            message = "database error"
        }


        //Foreign key constraint error: Referenced record not found.'

        this.loggerService.error({
            message: error,
            logData: { error: exception.stack || exception.message }
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