import { IsEmail, IsString } from "class-validator";

export class LoginDto {

    @IsString()
    readonly password: string;

    @IsString()
    @IsEmail({}, {
        message: "Invalid Email",
    })
    readonly email: string
}