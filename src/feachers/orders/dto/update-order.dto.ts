import { IsOptional, IsNotEmpty, IsInt, IsEnum, IsString, IsBoolean } from "class-validator";
import { OrderStatus } from "src/core/constants";

export class UpdateOrderDto {
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    phoneId?: number

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    addressId?: number

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    userId?: number

    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsOptional()
    @IsBoolean()
    updateStock?: boolean = false;

    @IsOptional()
    @IsString()
    reason?: string;

    deliveredAt?: Date

}