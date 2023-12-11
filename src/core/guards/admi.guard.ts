import { ForbiddenException } from '@nestjs/common';
// admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/user.entity';
import { UserRole } from '../constants';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {


        const request = context.switchToHttp().getRequest();

        const user: User = request.user;


        if (user.role !== UserRole.ADMIN) throw new ForbiddenException();

        return true
    }
}
