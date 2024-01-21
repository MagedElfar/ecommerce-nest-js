import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { UserRole } from "src/core/constants";
import { BaseDto } from "src/core/dto/base-model.dto";
import { AddressDto } from "src/feachers/addresses/dto/address.dto";
import { MediaDto } from "src/feachers/media/dto/media.dto";
import { PhoneDto } from "src/feachers/phones/dto/phone.dto";

export class UserDto extends BaseDto {
    @ApiProperty({
        description: "username",
        example: "maged92",
        uniqueItems: true
    })
    name: string

    @ApiProperty({
        description: "user email",
        example: "maged@gmail.com",
        uniqueItems: true
    })
    email: string

    @ApiProperty({
        description: "user first name",
        example: "maged",
        nullable: true
    })
    firstName: string

    @ApiProperty({
        description: "user last name",
        example: "elfar",
        nullable: true
    })
    lastName: string

    @ApiProperty({
        description: "role",
        enum: UserRole,
        example: UserRole.ADMIN
    })
    role: UserRole

    @ApiProperty({
        description: "Image ID",
        example: 1,
        nullable: true
    })
    imageId: number

    @ApiProperty({
        description: "image object",
        nullable: true
    })
    image: MediaDto

    @ApiProperty({
        description: "user addresses",
        isArray: true
    })
    addresses: AddressDto

    @ApiProperty({
        description: "user phones",
        isArray: true
    })
    phones: PhoneDto
}
