import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseSchema } from "./base.schema";
import { UserSchema } from "./user.schema";

export class PhoneSchema extends BaseSchema {

    @ApiPropertyOptional({ description: "phone number" })
    phone: string

    @ApiPropertyOptional({ description: "user id" })
    userId: number

    @ApiPropertyOptional({ description: "user object" })
    user: UserSchema;
}