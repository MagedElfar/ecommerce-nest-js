import { PartialType, OmitType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsEnum, IsInt, IsNotEmpty, IsOptional, Min, ValidateNested, isInt } from "class-validator";
import { OrderStatus } from "src/core/constants";
import { IsAtLeastOne } from "src/core/decorators/is-at-least-one.decorator";
import { IsNotAllowWith } from "src/core/decorators/is-not-allow-with.decorator";
import { CreateAddressDto } from "src/feachers/addresses/dto/create-address.dto";
import { CreateOrderItemDto } from "src/feachers/orders-items/dto/create-order-item.dto";
import { CreatePhoneDto } from "src/feachers/phones/dto/create-phone.dto";

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
    @Min(1)
    @IsInt()

    addressId?: number

    @ApiPropertyOptional({
        description: "user address not allowed if addressId provided",
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreateAddressDto, ['userId'])))
    address?: CreateAddressDto

    @IsAtLeastOne({
        properties: ["addressId", "address"],
        message: "address or addressId at least one should exist"
    })
    @IsNotAllowWith({
        properties: ["addressId", "address"],
        message: "properties address and addressId is not allow together"
    })
    addressAndAddressId: any

    @ApiPropertyOptional({
        description: "user phone id not allowed if phone provided",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    phoneId?: number

    @ApiPropertyOptional({
        description: "user phone  not allowed if phoneId provided",
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PartialType(OmitType(CreatePhoneDto, ['userId'])))
    phone?: CreatePhoneDto

    @IsAtLeastOne({
        properties: ["phoneId", "phone"],
        message: "phone or phoneId at least one should exist"
    })
    @IsNotAllowWith({
        properties: ["phoneId", "phone"],
        message: "properties phone and phoneId is not allow together"
    })
    phoneAndPhoneId: any

    @ApiPropertyOptional({
        description: "payment method id",
    })
    @IsNotEmpty()
    @Min(1)
    @IsInt()
    paymentMethodId?: number


    @ApiProperty({
        description: "order items",
        isArray: true,
        type: CreateOrderItemDto
    })
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]
}