import { UpdateUserDto } from 'src/users/dto/updateUserDto.dto';
import { UsersService } from './../../users/users.service';
import { Body, Controller, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { User } from 'src/core/decorators/user.decorator';
import { ToLowerCasePipe } from 'src/core/pipes/common.pipe';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';
import { UserEntity } from 'src/users/user.entity';

@Controller('admin/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    async updated(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
            const user = await this.usersService.update(id, updateUserDto);

            return { user }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(
        @Body(ToLowerCasePipe) createUserDto: CreateUserDto,
    ): Promise<UserEntity> {

        try {
            return await this.usersService.create(createUserDto)
        } catch (error) {
            throw error
        }


    }

}
