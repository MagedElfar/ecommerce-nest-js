import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateUserDto {
    @Transform((param) => transformLowerCase(param))
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsEmail({}, {
        message: "Invalid Email",
        groups: ["create"]
    })
    @IsEmail({}, {
        groups: ["update"]
    })
    @IsNotEmpty()
    readonly email: string

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;


    // @IsEnum(Gender, {
    //     message: 'gender must be either male or female',
    // })
    // readonly gender: Gender;

}

