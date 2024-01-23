import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsInt, IsNotEmpty } from "class-validator"
import { UserRole } from "src/core/constants"

export class UpdateRoleDto {

    @ApiProperty({
        description: "user id",
        example: 1
    })
    @IsNotEmpty()
    @IsInt()
    userId: number

    @ApiProperty({
        description: "role value",
        examples: Object.values(UserRole),
        example: UserRole.ADMIN
    })
    @IsEnum(UserRole)
    role: UserRole
}