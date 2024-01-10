import { PartialType, OmitType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested, isInt } from "class-validator";
import { OrderStatus } from "src/core/constants";
import { NotEitherProperty } from "src/core/decorators/IsNotBothPropertiesPresent.decorator";
import { CreateAddressDto } from "src/feachers/addresses/dto/request/create-address.dto";
import { CreateOrderItemDto } from "src/feachers/orders-items/dto/create-order-item.dto";
import { CreatePhoneDto } from "src/feachers/phones/dto/request/create-phone.dto";

export class CreateOrderDto {

    @ApiProperty({
        description: "user id"
    })
    @IsNotEmpty()
    @IsInt()
    userId: number

    @ApiPropertyOptional({
        description: "user status",
        enum: OrderStatus
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus

    @ApiPropertyOptional({
        description: "user address id not allowed if address provided",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    addressId?: number

    @ApiPropertyOptional({
        description: "user address not allowed if addressId provided",
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateAddressDto, ['userId'])))
    address?: CreateAddressDto

    @ApiPropertyOptional({
        description: "user phone id not allowed if phone provided",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    phoneId?: number

    @ApiPropertyOptional({
        description: "user phone  not allowed if phoneId provided",
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreatePhoneDto, ['userId'])))
    phone?: CreatePhoneDto

    @ApiPropertyOptional({
        description: "payment method id",
    })
    @IsNotEmpty()
    @IsInt()
    paymentMethodId?: number

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


    @ApiProperty({
        description: "order items",
        isArray: true
    })
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]
}