import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from 'src/core/constants';

// Extend the CreateUserDto and exclude the password property
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) {
    password?: string

    role?: UserRole

    imageId?: number
}

