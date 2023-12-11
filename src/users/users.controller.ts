import { UsersService } from './users.service';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ToLowerCasePipe } from 'src/core/pipes/common.pipe';
import { User } from './user.entity';
import { AdminGuard } from 'src/core/guards/admi.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    // @Get()
    // findAll(): IUser[] {
    //     return this.usersService.findAll()
    // }

    @UseGuards(AdminGuard)
    @Post()
    async create(
        @Body(ToLowerCasePipe) createUserDto: CreateUserDto,
        @Req() req: any
    ): Promise<User> {

        console.log("user_ = ", req.user)

        return await this.usersService.create(createUserDto)
    }

    // @Put(":id")
    // updated(@Param("id", new ParseIntPipe({
    //     // errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
    //     exceptionFactory: () => {
    //         throw new HttpException('Invalid user ID. Please provide a valid integer ID.', HttpStatus.NOT_ACCEPTABLE);
    //     },
    // })) id: number, @Body(
    //     new ValidationPipe({
    //         whitelist: true,
    //         groups: ["update"]
    //     })
    // ) UpdateUserDto: UpdateUserDto): Partial<IUser> {
    //     console.log(id)
    //     return UpdateUserDto
    // }
}
