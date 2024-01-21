// is-admin.constraint.ts
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export interface IIsNotAllowWith {
    properties: string[],
    message: string
}

@ValidatorConstraint({ name: 'notAllowWith', async: true })
export class IsNotAllowWithConstraint implements ValidatorConstraintInterface {

    constructor(@Inject(REQUEST) private request: Request) { }

    validate(value: any, args: ValidationArguments) {

        const constraints = args.constraints[0]["properties"] as string[]

        return !constraints.every(prop => args.object[prop])

    }

    defaultMessage(args: ValidationArguments) {
        const message = args.constraints[0]["message"]

        return message;
    }
}


export function IsNotAllowWith(properties: IIsNotAllowWith, validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [properties],
            validator: IsNotAllowWithConstraint,
        });
    };
}