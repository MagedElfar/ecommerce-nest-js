import { UpdateUserDto } from 'src/feachers/users/dto/updateUserDto.dto';
import { UsersService } from '../../users/users.service';
import { Body, Controller, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { CreateUserDto } from 'src/feachers/users/dto/createUserDto.dto';
import { IUser } from 'src/feachers/users/users.interface';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminUsersService } from './admin-users.service';

@Controller('admin/users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private adminUsersService: AdminUsersService
    ) { }

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

    @Patch("role")
    @Roles([UserRole.ADMIN])
    async updatedRole(@Body() updateRoleDto: UpdateRoleDto) {
        try {
            await this.adminUsersService.updateRole(updateRoleDto);

            return { message: "role updated successfully" }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<IUser> {

        try {
            return await this.usersService.create(createUserDto)
        } catch (error) {
            throw error
        }


    }

}
