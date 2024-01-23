import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { UserDto } from "src/feachers/users/dto/user.dto";

// class AddressUser extends PickType(UserDto, []) { }

export class AddressDto extends BaseDto {

    @ApiProperty({
        description: "address country",
        example: "Egypt"
    })
    country: string

    @ApiProperty({
        description: "address city",
        example: "Alexandria"
    })
    city: string

    @ApiProperty({
        description: "address street name",
        example: "12 street"
    })
    street: string

    @ApiProperty({
        description: "address street line",
        example: "12 street name - at any where"
    })
    addressLine: string

    @ApiProperty({
        description: "user Id",
        example: 1
    })
    userId: number
}
