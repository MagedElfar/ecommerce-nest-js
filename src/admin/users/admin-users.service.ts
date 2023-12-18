import { UsersService } from './../../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class AdminUsersService {
    constructor(private readonly userService: UsersService) { }

    async updateRole(updateRoleDto: UpdateRoleDto): Promise<void> {
        try {
            const { userId, role } = updateRoleDto;

            const user = await this.userService.findById(userId);

            if (!user) throw new NotFoundException();

            await this.userService.update(userId, { role })
        } catch (error) {
            throw error
        }
    }

}
