import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsInt } from "class-validator";
import { OrderStatus } from "src/core/constants";
import { QueryDto } from "src/core/dto/query.dto";
import { transformInt } from "src/core/pipes/parseInt.pipe";

export class OrdersQueryDto extends QueryDto {

    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsOptional()
    @IsString()
    orderNumber: string = "";

    @IsOptional()
    @IsString()
    userName: string = ""

    @IsOptional()
    @Transform(param => transformInt(param))
    @IsInt()
    userId: number
}