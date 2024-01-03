import { UserRole } from 'src/core/constants';
import { BaseSchema } from './base.schema';
import { ApiPropertyOptional, OmitType } from "@nestjs/swagger"
import { MediaSchema } from './media.schema';
import { AddressSchema } from './address.schema';
import { PhoneSchema } from './phone.schema';
import { CartSchema } from './cart,schema';
import { FindAllSchema } from './find-all.schema';


class UserPhoneSchema extends OmitType(PhoneSchema, ["user"]) { }
class UserAddressSchema extends OmitType(AddressSchema, ["user"]) { }



export class UserSchema extends BaseSchema {

    @ApiPropertyOptional({
        description: "uses name 'unique value'"
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
        description: "uses email 'unique value'"
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
    addresses?: UserAddressSchema

    @ApiPropertyOptional({
        description: "uses phones",
        isArray: true,
    })
    phones?: UserPhoneSchema

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