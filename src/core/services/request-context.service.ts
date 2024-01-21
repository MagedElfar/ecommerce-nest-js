// request-context.service.ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestContextService {
    private static request: any;

    setRequest(request: any) {
        RequestContextService.request = request;
    }

    getRequest() {
        return RequestContextService.request;
    }
}
