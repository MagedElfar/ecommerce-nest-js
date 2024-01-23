import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';


@ValidatorConstraint({ name: 'dateRange', async: false })
export class DateRangeConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {


        const [relatedPropertyName] = args.constraints;
        const fromValue = (args.object as any)[relatedPropertyName];

        if (!value || !fromValue) {
            return true; // Validation will be handled by @IsDateString
        }


        const fromDate = moment(fromValue, "MM/DD/YYYY");
        const toDate = moment(value, "MM/DD/YYYY");

        console.log("from = ", fromDate)
        console.log("to = ", toDate)


        return fromDate.isBefore(toDate);

    }

    defaultMessage(args: ValidationArguments) {
        return `toDate must be grater than fromDate`;
    }
}

export function IsDateInRange(property: string, validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: DateRangeConstraint,
        });
    };
}
