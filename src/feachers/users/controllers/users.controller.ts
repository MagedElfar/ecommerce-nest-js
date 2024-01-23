import { UsersService } from '../services/users.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserQueryDto } from '../dto/userQuery.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { UserDto } from 'src/feachers/users/dto/user.dto';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserScop } from '../user.entity';
import { ApiFindAllResponse } from 'src/core/decorators/api-find-all-response.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Find all users' })
    @ApiFindAllResponse(UserDto)
    async findAll(@Query() userQueryDto: UserQueryDto) {
        try {

            return await this.usersService.findAll(userQueryDto, [
                UserScop.EXCLUDE_PASSWORD,
                UserScop.WITH_Media
            ]);

        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @ApiOperation({ summary: 'Find user by ID' })
    @ApiParam({ name: "id", description: "user ID" })
    @ApiOkResponse({ type: UserDto })
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

            if (!user) throw new NotFoundException("User not found");

            return user
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: "create new user",
        description: `Role Required: ${UserRole.ADMIN}`
    })
    @ApiCreatedResponse({ type: UserDto })
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
    @ApiOkResponse({ type: UserDto })
    async updated(@User("id") id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
            return await this.usersService.update(id, updateUserDto);
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: 'update user by ID',
        description: `Role Required: ${UserRole.ADMIN}`
    })
    @ApiParam({
        name: "id",
        description: "user ID"
    })
    @ApiOkResponse({ type: UserDto })
    async updatedById(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
            return await this.usersService.update(id, updateUserDto);
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Patch("role")
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: 'update user',
        description: `Role Required: ${UserRole.ADMIN}`
    })
    async updatedRole(@Body() updateRoleDto: UpdateRoleDto) {

        const { userId, role } = updateRoleDto

        try {
            await this.usersService.update(userId, { role });

            return { message: "Role updated successfully" }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: 'delete user',
        description: `Role Required: ${UserRole.ADMIN}`
    })
    async deleteUser(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.usersService.delete(id);

            return { message: "User deleted successfully" }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
