// permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Permission_service } from '../constants';

export const Permissions = (service: any) => SetMetadata(Permission_service, service);
