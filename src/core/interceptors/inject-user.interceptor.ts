import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";

export const REQUEST_CONTEXT = '_requestContext';

type Nullable<T> = T | null;

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        console.log("InjectUserInterceptor")
        request.body.context = {
            user: request.user,
        };

        return next.handle();
    }
}