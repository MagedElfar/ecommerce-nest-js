import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsInt, IsEnum, IsString, IsBoolean } from "class-validator";
import { OrderStatus } from "src/core/constants";

export class UpdateOrderDto {
    @ApiPropertyOptional({
        description: "phone id",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    phoneId?: number

    @ApiPropertyOptional({
        description: "address id",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    addressId?: number

    @ApiPropertyOptional({
        description: "user id",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    userId?: number

    @ApiPropertyOptional({
        description: "order status",
        enum: OrderStatus
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiPropertyOptional({
        description: "update stock quantity by decrease",
    })
    @IsOptional()
    @IsBoolean()
    removeFromStock?: boolean = false;

    @ApiPropertyOptional({
        description: "update stock quantity by increase",
    })
    @IsOptional()
    @IsBoolean()
    addToStock?: boolean = false;

    @ApiPropertyOptional({
        description: "order cancel reason",
    })
    @IsOptional()
    @IsString()
    reason?: string;

    deliveredAt?: any

}