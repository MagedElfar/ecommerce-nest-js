// is-admin.constraint.ts
import { ExecutionContext, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { REQUEST_CONTEXT } from '../interceptors/inject-user.interceptor';
import { User } from 'src/feachers/users/user.entity';
import { UserRole } from '../constants';

export interface ContextValidationArguments extends ValidationArguments {
    object: {
        context: {
            user: User
        }
    } & Object
}

@Injectable({ scope: Scope.REQUEST })
@ValidatorConstraint({ name: 'isAdmin', async: true })
export class IsAllowConstraint implements ValidatorConstraintInterface {

    constructor(@Inject(REQUEST) private request: Request) { }

    validate(value: any, args: ContextValidationArguments) {

        if (args.object.context.user.role !== UserRole.ADMIN) return false

        return true

    }

    defaultMessage(args: ValidationArguments) {
        return `userId property allow with admin only`;
    }
}


export function IsAllow(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsAllowConstraint,
        });
    };
}