import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsInt } from "class-validator";
import { OrderStatus } from "src/core/constants";
import { QueryDto } from "src/core/dto/query.dto";
import { transformInt } from "src/core/pipes/parseInt.pipe";

export class OrdersQueryDto extends QueryDto {

    @ApiPropertyOptional({
        description: "order status",
        enum: OrderStatus
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiPropertyOptional({
        description: "order number",
    })
    @IsOptional()
    @IsString()
    orderNumber: string = "";

    @ApiPropertyOptional({
        description: "customer name",
    })
    @IsOptional()
    @IsString()
    userName: string = ""

    @ApiPropertyOptional({
        description: "user id",
    })
    @IsOptional()
    @Transform(param => transformInt(param))
    @IsInt()
    userId: number
}

export class UserOrdersQueryDto extends OmitType(OrdersQueryDto, ["userId"]) {
    userId: number

    userName: string = ""
}