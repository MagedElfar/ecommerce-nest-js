import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class FindUsersDto extends OmitType(UserDto, ["addresses", "phones", "addresses"]) { }