import { UserRepository } from './../user.repository';
import { UserQueryDto } from '../dto/userQuery.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserScop } from '../user.entity';
import { IUser } from '../users.interface';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Op, where } from 'sequelize';
import { UpdateRoleDto } from '../dto/update-role.dto';


@Injectable()
export class UsersService {


    constructor(private readonly userRepository: UserRepository) { }

    async findAll(userQueryDto: UserQueryDto, scope: any[] = []) {
        try {
            const { limit, page, term, ...others } = userQueryDto;

            const result = await this.userRepository.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${term}%` } },
                        { firstName: { [Op.iLike]: `%${term}%` } },
                        { lastName: { [Op.iLike]: `%${term}%` } }
                    ],
                    ...others
                },
                options: { limit },
                scope
            });

            return result
        } catch (error) {
            throw error
        }
    }

    async findById(id: number, scope: any[] = []): Promise<User | null> {
        try {

            return await this.userRepository.findById(id, scope);

        } catch (error) {
            throw error
        }
    }


    async findOne(where: IUser, scope: any[] = []): Promise<User | null> {
        try {

            return await this.userRepository.findOne({ where, scope })

        } catch (error) {
            throw error
        }
    }

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        try {

            return await this.userRepository.create(createUserDto)

        } catch (error) {

            throw error
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {

            const affectedRows = await this.userRepository.update(id, updateUserDto)

            if (affectedRows === 0)
                throw new NotFoundException("User not found")

            return await this.findById(id, [UserScop.EXCLUDE_PASSWORD])
        } catch (error) {
            throw error
        }
    }



    async delete(id: number): Promise<void> {
        try {

            const isDeleted = await this.userRepository.delete(id)

            if (!isDeleted)
                throw new NotFoundException("User not found")

            return
        } catch (error) {
            throw error
        }
    }
}
