import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class CreateUserResponseDto extends OmitType(UserDto, ["addresses", "image", "phones"]) { }