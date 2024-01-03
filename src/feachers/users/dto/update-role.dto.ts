import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsInt, IsNotEmpty } from "class-validator"
import { UserRole } from "src/core/constants"

export class UpdateRoleDto {

    @ApiProperty({ description: "user id" })
    @IsNotEmpty()
    @IsInt()
    userId: number

    @ApiProperty({ description: "role value" })
    @IsEnum(UserRole)
    role: UserRole
}