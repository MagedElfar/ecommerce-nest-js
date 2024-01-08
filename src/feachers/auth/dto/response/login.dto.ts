import { ApiPropertyOptional } from "@nestjs/swagger"
import { UserDto } from "src/feachers/users/dto/response/user.dto"

export class LoginResponseDto {
    @ApiPropertyOptional({
        description: "User Data"
    })
    user: UserDto

    @ApiPropertyOptional({
        description: "Access token"
    })
    token: string
}