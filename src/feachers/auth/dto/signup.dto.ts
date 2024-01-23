import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "src/feachers/users/dto/create-user.dto";

export class SignUpDto extends OmitType(CreateUserDto, ["firstName", "lastName"]) { }

