import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseSchema } from "./base.schema";
import { UserSchema } from "./user.schema";
import { FindAllSchema } from "./find-all.schema";

export class PhoneSchema extends BaseSchema {

    @ApiPropertyOptional({
        description: "phone number", uniqueItems: true
    })
    phone: string

    @ApiPropertyOptional({ description: "user id" })
    userId: number
}

export class FindAlLPhoneSchema extends FindAllSchema {

    @ApiPropertyOptional({
        description: "user array",
        isArray: true
    })
    rows: PhoneSchema
}