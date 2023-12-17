import { UsersService } from './users.service';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, NotAcceptableException, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ToLowerCasePipe } from 'src/core/pipes/common.pipe';
import { UserEntity } from './user.entity';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUserDto.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    // @Get()
    // findAll(): IUser[] {
    //     return this.usersService.findAll()
    // }

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
