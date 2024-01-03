import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseSchema } from "./base.schema";
import { UserSchema } from "./user.schema";

export class AddressSchema extends BaseSchema {

    @ApiPropertyOptional({ description: "address country" })
    country: string

    @ApiPropertyOptional({ description: "address city" })
    city: string

    @ApiPropertyOptional({ description: "address street" })
    street: string

    @ApiPropertyOptional({ description: "address details" })
    addressLine: string

    @ApiPropertyOptional({ description: "user id" })
    userId: number

    @ApiPropertyOptional({ description: "user object" })
    user: UserSchema;
}