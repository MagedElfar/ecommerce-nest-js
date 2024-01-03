import { ApiProperty } from "@nestjs/swagger"
import { IAddress } from "../address.interface"

export class CreateAddressResponse implements IAddress {
    @ApiProperty({ description: "address id" })
    id: number
}