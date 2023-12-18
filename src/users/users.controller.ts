import { UsersService } from './users.service';
import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { UserQueryDto } from './dto/userQuery.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@Query() userQueryDto: UserQueryDto) {
        try {
            const users = await this.usersService.findAll(userQueryDto);
            const count = await this.usersService.getCount(userQueryDto)
            return { count, users }
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const user = await this.usersService.findOneFullData({ id })

            if (!user) throw new NotFoundException();

            return { user }
        } catch (error) {
            throw error
        }
    }

    @Put()
    async updated(@User("id") id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
            const user = await this.usersService.update(id, updateUserDto);

            return { user }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
