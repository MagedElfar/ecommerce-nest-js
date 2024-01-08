import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { transformLowerCase } from "src/core/pipes/toLowerCase.pipe";

export class CreateUserDto {
    @ApiProperty({
        description: "username",
        example: "maged",
        uniqueItems: true
    })
    @Transform((param) => transformLowerCase(param))
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({
        description: "user password",
        example: "12345678"
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({
        description: "user email",
        example: "maged.1992.me@gmail.com",
        uniqueItems: true
    })
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

    @ApiPropertyOptional({
        description: "user first name",
        example: "maged"
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({
        description: "user last name",
        example: "elfar"
    })
    @IsOptional()
    @IsString()
    lastName?: string;


}

