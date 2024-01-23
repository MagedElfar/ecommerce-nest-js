import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsNotEmpty } from "class-validator";
import { Match } from "src/core/decorators/is-match.validation.decorator";
import { CreateUserDto } from "src/feachers/users/dto/create-user.dto";

export class ForgetPasswordRestDto extends PickType(CreateUserDto, ["password", "email"]) {

    @ApiProperty({
        description: "password confirmation"
    })
    @IsNotEmpty()
    @IsString()
    @Match('password', { message: 'Passwords must match' })
    confirmPassword: string;

    @ApiProperty({
        description: "forget password rest token"
    })
    @IsString()
    @IsNotEmpty()
    token: string;
}