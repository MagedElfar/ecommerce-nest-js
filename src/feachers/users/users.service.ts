import { UserQueryDto } from './dto/userQuery.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { User } from './user.entity';
import { IUser } from './users.interface';
import { InjectModel } from '@nestjs/sequelize';
import { UserImages } from 'src/feachers/users-images/users-images.entity';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { Op } from 'sequelize';


@Injectable()
export class UsersService {


    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    async findAll(userQueryDto: UserQueryDto) {
        try {
            const { limit, page, name } = userQueryDto;

            const result = await this.userModel.findAll({
                where: {
                    name: { [Op.like]: `%${name}%` }
                },
                include: [
                    { model: UserImages, limit: 10, attributes: ["id", "url"] }
                ],
                attributes: { exclude: ["password"] },
                limit,
                offset: (page - 1) * limit
            });

            const users = result.map(item => item["dataValues"])

            return users
        } catch (error) {
            throw error
        }
    }

    async getCount(userQueryDto: UserQueryDto): Promise<number> {
        try {

            const { name } = userQueryDto;
            const count = await this.userModel.count({
                where: {
                    name: { [Op.like]: `%${name}%` }
                },
            });

            return count
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IUser, "images">>): Promise<IUser | null> {
        try {
            const user = await this.userModel.findOne({ where: data });

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneFullData(data: Partial<Omit<IUser, "images">>): Promise<Partial<IUser> | null> {
        try {
            const user = await this.userModel.findOne({
                where: data,
                attributes: { exclude: ["password"] },
                include: [{
                    model: UserImages,
                    limit: 10,
                    attributes: ["id", "url"]
                }]
            });

            if (!user) return null


            return user
        } catch (error) {
            throw error
        }
    }


    async findById(id: number): Promise<IUser | null> {
        try {
            const user = await this.userModel.findByPk(id);

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

    async update(id: number, updateUserDto: UpdateUserDto | Partial<Omit<IUser, "images">>): Promise<Partial<IUser>> {
        try {
            let user = await this.findById(id);

            if (!user) throw new NotFoundException()

            await this.userModel.update(updateUserDto, { where: { id } });

            const { password, ...result } = user

            return {
                ...result,
                ...updateUserDto
            }
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('user email or name address is already in use');
            }
            throw error
        }
    }


}
