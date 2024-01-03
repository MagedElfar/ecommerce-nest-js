import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateUserDto {
    @ApiProperty({ description: "username" })
    @Transform((param) => transformLowerCase(param))
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ description: "user password" })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ description: "user email" })
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

    @ApiPropertyOptional({ description: "user first name" })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ description: "user last name" })
    @IsOptional()
    @IsString()
    lastName?: string;


    // @IsEnum(Gender, {
    //     message: 'gender must be either male or female',
    // })
    // readonly gender: Gender;

}

