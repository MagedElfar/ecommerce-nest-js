import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Permission_service, UserRole } from '../constants';

@Injectable()
export class OwnerShipGuard implements CanActivate {
    private service: any;

    constructor(
        private readonly reflector: Reflector,
        private moduleRef: ModuleRef
    ) { }

    async canActivate(
        ctx: ExecutionContext,
    ): Promise<boolean> {

        const request = ctx.switchToHttp().getRequest();

        const service = this.reflector.get(Permission_service, ctx.getClass());

        const userId = request.user.id;
        const userRole = request.user.role
        const resourceId = request.params.id

        if ([UserRole.ADMIN, UserRole.MANAGER].includes(userRole)) return true

        this.service = await this.moduleRef.create(service);

        const resource = await this.service.findById(resourceId)

        if (userId !== resource?.userId) {
            throw new ForbiddenException('Access Denied');
        }

        return true;
    }
}
