import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "src/feachers/users/dto/create-user.dto";

export class SendForgetPasswordEmailDto extends PickType(CreateUserDto, ["email"]) { }