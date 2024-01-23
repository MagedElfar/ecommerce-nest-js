import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';


@ValidatorConstraint({ name: 'validDate', async: false })
export class ValidDateConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {

        if (!value) {
            return true; // Validation will be handled by @IsDateString
        }

        const isValid = moment(value, 'MM/DD/YYYY', true).isValid();
        return isValid;
    }

    defaultMessage(args: ValidationArguments) {
        return "date must be in MM/DD/YYYY format";
    }
}

export function IsValidDate(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: ValidDateConstraint,
        });
    };
}
