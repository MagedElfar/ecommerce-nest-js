import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

interface IProperties {
    property1: string,
    property2: string,
    name: string
}
export function NotEitherProperty(properties: IProperties, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: properties.name,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const prop1 = args.object[properties.property1];
                    const prop2 = args.object[properties.property2];

                    if ((prop1 && !prop2) || (!prop1 && prop2)) {
                        return true;
                    }

                    // If validation fails, add a default error message to the validation context
                    args.constraints.push(`${properties.property1} and ${properties.property2} must not both be present or absent.`);

                    return false;
                },
            },
        });
    };
}
