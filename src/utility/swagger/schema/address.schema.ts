import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { BaseSchema } from "./base.schema";
import { FindAllSchema } from "./find-all.schema";

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
}

export class FindAlAddressSchema extends FindAllSchema {

    @ApiPropertyOptional({
        description: "user array",
        isArray: true
    })
    rows: AddressSchema
}