import { ApiPropertyOptional } from "@nestjs/swagger"
import { UserSchema } from "./user.schema"

export class AuthSchema {

    @ApiPropertyOptional({
        description: "User Data"
    })
    user: UserSchema

    @ApiPropertyOptional({
        description: "Access token"
    })
    token: string
}