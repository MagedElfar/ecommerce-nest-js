import { UsersService } from '../services/users.service';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateUserDto } from '../dto/request/updateUserDto.dto';
import { UserQueryDto } from '../dto/request/userQuery.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { UserDto } from 'src/feachers/users/dto/response/user.dto';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { UpdateRoleDto } from '../dto/request/update-role.dto';
import { CreateUserDto } from '../dto/request/createUserDto.dto';
import { UserScop } from '../user.entity';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { FindUsersDto } from '../dto/response/findUsers.dto';
import { FindUserDto } from '../dto/response/findUser.dto';
import { CreateUserResponseDto } from '../dto/response/createUser.dto';
import { UpdateUserResponseDto } from '../dto/response/updateUser.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Find all users' })
    @ApiFindAllResponse(FindUsersDto)
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
    @ApiOperation({ summary: 'Find user by ID' })
    @ApiParam({ name: "id", description: "user ID" })
    @ApiOkResponse({ type: FindUserDto })
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
    @ApiOperation({ summary: "create new user" })
    @ApiCreatedResponse({ type: CreateUserResponseDto })
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
    @ApiOperation({ summary: 'update current user' })
    @ApiOkResponse({ type: UpdateUserResponseDto })
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
    @ApiOperation({ summary: 'update user by ID' })
    @ApiParam({ name: "id", description: "user ID" })
    @ApiOkResponse({ type: UpdateUserResponseDto })
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
    @ApiOperation({ summary: 'update user' })
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
