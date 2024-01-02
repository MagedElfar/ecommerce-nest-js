// raw-body.middleware.ts
import * as bodyParser from 'body-parser';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    use(req: any, res: any, next: any) {
        bodyParser.raw({ type: '*/*' })(req, res, (err: any) => {
            if (err) {
                return next(err);
            }
            next();
        });
    }
}
