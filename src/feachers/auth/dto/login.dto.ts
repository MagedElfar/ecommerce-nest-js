import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { UserDto } from "src/feachers/users/dto/user.dto";

export class LoginDto {

    @ApiProperty({
        description: "user email",
        example: "maged.1992.me@gmail.com"
    })
    @IsString()
    @IsEmail({}, {
        message: "Invalid Email",
    })
    readonly email: string

    @ApiProperty({
        description: "user password",
        example: "12345678"
    })
    @IsString()
    readonly password: string;

}