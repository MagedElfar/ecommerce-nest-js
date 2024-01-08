import { ApiPropertyOptional, OmitType, PickType } from "@nestjs/swagger"
import { UserDto } from "src/feachers/users/dto/response/user.dto"

class SignupUser extends PickType(UserDto, ["id", "name", "email", "createdAt", "updatedAt"]) { }

export class SignupResponseDto {
    @ApiPropertyOptional({
        description: "User Data"
    })
    user: SignupUser

    @ApiPropertyOptional({
        description: "Access token"
    })
    token: string
}