import { UserQueryDto } from '../dto/request/userQuery.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/request/createUserDto.dto';
import { User, UserScop } from '../user.entity';
import { IUser } from '../users.interface';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDto } from '../dto/request/updateUserDto.dto';
import { Op } from 'sequelize';
import { UpdateRoleDto } from '../dto/request/update-role.dto';


@Injectable()
export class UsersService {


    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    async findAll(userQueryDto: UserQueryDto, scope: any[] = []) {
        try {
            const { limit, page, name } = userQueryDto;

            const result = await this.userModel.scope(scope).findAndCountAll({
                where: {
                    name: { [Op.like]: `%${name}%` }
                },
                limit,
                offset: (page - 1) * limit
            });


            return result
        } catch (error) {
            throw error
        }
    }

    async findById(id: number, scope: any[] = []): Promise<IUser | null> {
        try {
            const user = await this.userModel.scope(scope).findByPk(
                id
            );

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }


    async findOne(data: Partial<Omit<IUser, "image">>, scope: any[] = []): Promise<IUser | null> {
        try {
            const user = await this.userModel.scope(scope).findOne({
                where: data,
            });

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        try {
            const user = await this.userModel.create<User>(createUserDto);

            return user["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Email address is already in use');
            }
            throw error
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto | Partial<Omit<IUser, "image" | "addresses" | "phones">>): Promise<Partial<IUser>> {
        try {
            let user = await this.findById(id);

            if (!user) throw new NotFoundException()

            await this.userModel.update(updateUserDto, { where: { id } });

            const { password, ...result } = user

            return await this.findById(id, [
                UserScop.EXCLUDE_PASSWORD,
                UserScop.WITH_Media,
                UserScop.WITH_PHONE,
                UserScop.WITH_ADDRESS
            ])
        } catch (error) {
            throw error
        }
    }

    async updateRole(updateRoleDto: UpdateRoleDto): Promise<void> {
        try {
            const { userId, role } = updateRoleDto;

            const user = await this.findById(userId);

            if (!user) throw new NotFoundException();

            await this.update(userId, { role })
        } catch (error) {
            throw error
        }
    }
}
