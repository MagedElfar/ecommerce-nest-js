import { IsEnum, IsInt, IsNotEmpty } from "class-validator"
import { UserRole } from "src/core/constants"

export class UpdateRoleDto {

    @IsNotEmpty()
    @IsInt()
    userId: number

    @IsEnum(UserRole)
    role: UserRole
}