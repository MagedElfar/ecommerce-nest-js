import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';

@Injectable()
export class ToLowerCasePipe implements PipeTransform {
    transform(value: CreateUserDto, metadata: ArgumentMetadata) {
        console.log("name = ", value.name)
        return {
            ...value,
            name: value.name.toLowerCase()
        }
    }
}