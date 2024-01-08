import { PartialType, OmitType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { ArrayMinSize, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested, isInt } from "class-validator";
import { OrderStatus } from "src/core/constants";
import { NotEitherProperty } from "src/core/decorators/IsNotBothPropertiesPresent.decorator";
import { CreateAddressDto } from "src/feachers/addresses/dto/request/create-address.dto";
import { CreateOrderItemDto } from "src/feachers/orders-items/dto/create-order-item.dto";
import { CreatePhoneDto } from "src/feachers/phones/dto/request/create-phone.dto";

export class CreateOrderDto {

    @IsNotEmpty()
    @IsInt()
    userId: number

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    addressId?: number

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateAddressDto, ['userId'])))
    address?: CreateAddressDto

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    phoneId?: number

    @IsNotEmpty()
    @IsInt()
    paymentMethodId?: number

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreatePhoneDto, ['userId'])))
    phone?: CreatePhoneDto

    @NotEitherProperty({
        property1: "phone",
        property2: "phoneId",
        name: "phoneAndPhoneId"
    }, { message: 'Either phone or phoneId must be present, but not both.' })
    phoneAndPhoneId?: boolean

    @NotEitherProperty({
        property1: "address",
        property2: "addressId",
        name: "addressAndAddressId"
    }, { message: 'Either address or addressId must be present, but not both.' })
    addressAndAddressId?: boolean


    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]
}