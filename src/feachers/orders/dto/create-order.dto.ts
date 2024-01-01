import { PartialType, OmitType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateIf, ValidateNested } from "class-validator";
import { PaymentMethod } from "src/core/constants";
import { NotEitherProperty } from "src/core/decorators/IsNotBothPropertiesPresent.decorator";
import { CreateAddressDto } from "src/feachers/addresses/dto/create-address.dto";
import { CreatePhoneDto } from "src/feachers/phones/dto/create-phone.dto";

export class CreateOrderDto {

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    addressId: number

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateAddressDto, ['userId'])))
    address: CreateAddressDto

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    phoneId: number

    @IsNotEmpty()
    @IsInt()
    paymentMethodId: number

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreatePhoneDto, ['userId'])))
    phone: CreatePhoneDto

    @NotEitherProperty({
        property1: "phone",
        property2: "phoneId",
        name: "phoneAndPhoneId"
    }, { message: 'Either phone or phoneId must be present, but not both.' })
    phoneAndPhoneId: boolean

    @NotEitherProperty({
        property1: "address",
        property2: "addressId",
        name: "addressAndAddressId"
    }, { message: 'Either address or addressId must be present, but not both.' })
    addressAndAddressId: boolean

    userId?: number
}