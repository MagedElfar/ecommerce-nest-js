import { UserRole } from 'src/core/constants';
import { BaseDto } from '../../../core/dto/base-model.dto';
import { ApiPropertyOptional, OmitType } from "@nestjs/swagger"

import { AddressDto } from 'src/feachers/addresses/dto/address.dto';
import { MediaDto } from 'src/feachers/media/dto/media.dto';



export class UserDto extends BaseDto {

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
        description: "uses role",
        enum: UserRole
    })
    role?: UserRole

    @ApiPropertyOptional({
        description: "uses image id"
    })
    imageId?: number;

    @ApiPropertyOptional({
        description: "uses image object"
    })
    image?: MediaDto;

    @ApiPropertyOptional({
        description: "uses address",
        isArray: true,
    })
    addresses?: AddressDto

    @ApiPropertyOptional({
        description: "uses phones",
        isArray: true,
    })
    phones?: any
}

export class UserOmittedPropertyDto extends OmitType(UserDto, ["password", "image", "phones", "addresses"]) { }
