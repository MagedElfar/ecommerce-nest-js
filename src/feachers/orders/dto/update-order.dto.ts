import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsInt, IsEnum, IsString, IsBoolean, ValidateIf, Min } from "class-validator";
import { OrderStatus } from "src/core/constants";
import { IsAllowWith } from "src/core/decorators/is-allow-with.decorator";
import { IsNotAllowWith } from "src/core/decorators/is-not-allow-with.decorator";

export class UpdateOrderDto {
    @ApiPropertyOptional({
        description: "phone id",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    phoneId?: number

    @ApiPropertyOptional({
        description: "address id",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    addressId?: number

    @ApiPropertyOptional({
        description: "user id",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
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

    @IsNotAllowWith({
        properties: ["addToStock", "removeFromStock"],
        message: "properties addToStock and removeFromStock is not allow together"
    })
    stockOperation?: any

    @ApiPropertyOptional({
        description: "order cancel reason",
    })
    @IsOptional()
    @IsString()
    @IsAllowWith({
        property: "status",
        value: OrderStatus.CANCELLED,
        message: "reason field allow only with order cancelled status"
    })
    reason?: string;

    deliveredAt?: any

}