import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {

    @ApiProperty({ description: "user email" })
    @IsString()
    @IsEmail({}, {
        message: "Invalid Email",
    })
    readonly email: string

    @ApiProperty({ description: "user password" })
    @IsString()
    readonly password: string;

}