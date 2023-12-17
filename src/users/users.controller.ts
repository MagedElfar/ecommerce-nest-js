import { UsersService } from './users.service';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, NotAcceptableException, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ToLowerCasePipe } from 'src/core/pipes/common.pipe';
import { UserEntity } from './user.entity';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { User } from 'src/core/decorators/user.decorator';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    // @Get()
    // findAll(): IUser[] {
    //     return this.usersService.findAll()
    // }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.USER])
    async create(
        @Body(ToLowerCasePipe) createUserDto: CreateUserDto,
        @User() user: UserEntity
    ): Promise<UserEntity> {

        try {
            console.log("user = ", user)
            return await this.usersService.create(createUserDto)
        } catch (error) {
            throw error
        }


    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const user = await this.usersService.findOneFullData({ id })

            if (!user) throw new NotFoundException();

            return user
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    updated(@Param("id", new ParseIntPipe({
        // errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
        exceptionFactory: () => {
            throw new NotAcceptableException("Invalid user ID. Please provide a valid integer ID.");
        },
    })) id: number) {
        console.log(id)
        return "done"
    }
}
