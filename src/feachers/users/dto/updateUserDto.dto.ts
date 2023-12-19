import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto.dto';

// Extend the CreateUserDto and exclude the password property
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) { }

