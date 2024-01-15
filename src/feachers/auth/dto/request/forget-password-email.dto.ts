import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "src/feachers/users/dto/request/createUserDto.dto";

export class SendForgetPasswordEmailDto extends PickType(CreateUserDto, ["email"]) { }