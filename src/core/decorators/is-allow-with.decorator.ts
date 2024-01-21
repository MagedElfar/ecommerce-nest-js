// is-admin.constraint.ts
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export interface IIsNotAllowWith {
    property: string,
    value?: string
    message: string
}

@ValidatorConstraint({ name: 'allowWith', async: true })
export class IsAllowWithConstraint implements ValidatorConstraintInterface {

    constructor(@Inject(REQUEST) private request: Request) { }

    validate(value: any, args: ValidationArguments) {

        const constraints = args.constraints[0]

        const property = constraints["property"]

        const field = args.object[property]

        const probValue = constraints["value"]

        if (!property) return false

        console.log(property)
        if (probValue && field !== probValue) return false

        return true

    }

    defaultMessage(args: ValidationArguments) {
        const message = args.constraints[0]["message"]

        return message;
    }
}


export function IsAllowWith(properties: IIsNotAllowWith, validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [properties],
            validator: IsAllowWithConstraint,
        });
    };
}