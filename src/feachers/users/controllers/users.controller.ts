import { UsersService } from '../services/users.service';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateUserDto } from '../dto/updateUserDto.dto';
import { UserQueryDto } from '../dto/userQuery.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { UserDto, UserOmittedPropertyDto } from 'src/feachers/users/dto/user.dto';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateUserDto } from '../dto/createUserDto.dto';
import { UserScop } from '../user.entity';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Find all users' })
    @ApiFindAllResponse(UserOmittedPropertyDto)
    async findAll(@Query() userQueryDto: UserQueryDto) {
        try {
            const users = await this.usersService.findAll(userQueryDto, [
                UserScop.EXCLUDE_PASSWORD,
                UserScop.WITH_Media
            ]);
            return users
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @ApiOperation({ summary: 'retrieve user by id' })
    @ApiOkResponse({
        type: OmitType(UserDto, ["password"])
    })
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const user = await this.usersService.findById(
                id,
                [
                    UserScop.EXCLUDE_PASSWORD,
                    UserScop.WITH_Media,
                    UserScop.WITH_PHONE,
                    UserScop.WITH_ADDRESS
                ]
            )

            if (!user) throw new NotFoundException();

            return user
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "create new user used by admin" })
    @ApiCreatedResponse({
        type: OmitType(UserDto, ["password", "addresses", "phones", "image"])
    })
    async create(
        @Body() createUserDto: CreateUserDto,
    ) {
        try {
            return await this.usersService.create(createUserDto)
        } catch (error) {
            throw error
        }
    }

    @Put()
    @ApiOperation({ summary: 'update user' })
    @ApiResponse({
        description: "succuss request",
        type: OmitType(UserDto, ["password"]),
    })
    async updated(@User("id") id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
            const user = await this.usersService.update(id, updateUserDto);
            return user
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: 'update user used by admin' })
    @ApiOkResponse({
        type: OmitType(UserDto, ["password"])
    })
    async updatedById(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
            const user = await this.usersService.update(id, updateUserDto);

            return { user }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Patch("role")
    @Roles([UserRole.ADMIN])
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'update user role used by admin' })
    async updatedRole(@Body() updateRoleDto: UpdateRoleDto) {
        try {
            await this.usersService.updateRole(updateRoleDto);

            return
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
