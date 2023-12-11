import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const body = plainToClass(request.method === 'POST' ? request.body.constructor : Object, request.body);
        const errors = await validate(body);

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return next.handle();
    }
}
