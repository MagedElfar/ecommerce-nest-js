import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "src/feachers/users/dto/createUserDto.dto";
import { UserOmittedPropertyDto } from "src/feachers/users/dto/user.dto";

export class SignUpDto extends OmitType(CreateUserDto, ["firstName", "lastName"]) { }


export class SignResponseUpDto {
    @ApiPropertyOptional({
        description: "User Data"
    })
    user: UserOmittedPropertyDto

    @ApiPropertyOptional({
        description: "Access token"
    })
    token: string
}