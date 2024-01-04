import { UserRole } from 'src/core/constants';
import { BaseSchema } from './base.schema';
import { ApiPropertyOptional, OmitType } from "@nestjs/swagger"
import { MediaSchema } from './media.schema'
import { PhoneSchema } from './phone.schema';
import { CartSchema } from './cart,schema';
import { FindAllSchema } from './find-all.schema';
import { AddressSchema } from './address.schema';



export class UserSchema extends BaseSchema {

    @ApiPropertyOptional({
        description: "uses name",
        uniqueItems: true
    })
    name?: string

    @ApiPropertyOptional({
        description: "uses first name"
    })
    firstName?: string;

    @ApiPropertyOptional({
        description: "uses last name"
    })
    lastName?: string;

    @ApiPropertyOptional({
        description: "uses email",
        uniqueItems: true
    })
    email?: string;


    @ApiPropertyOptional({
        description: "uses password"
    })
    password?: string;

    @ApiPropertyOptional({
        description: `uses role , valid values [${Object.values(UserRole)}]`
    })
    role?: UserRole

    @ApiPropertyOptional({
        description: "uses image id"
    })
    imageId?: number;

    @ApiPropertyOptional({
        description: "uses image object"
    })
    image?: MediaSchema;

    @ApiPropertyOptional({
        description: "uses address",
        isArray: true,
    })
    addresses?: AddressSchema

    @ApiPropertyOptional({
        description: "uses phones",
        isArray: true,
    })
    phones?: PhoneSchema

    @ApiPropertyOptional({
        description: "uses shipping cart"
    })
    cart?: CartSchema;
}

export class FindAllUserSchema extends FindAllSchema {

    @ApiPropertyOptional({
        description: "user array"
    })
    rows: UserSchema
}

