import { UserQueryDto } from '../dto/userQuery.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUserDto.dto';
import { User } from '../user.entity';
import { IUser } from '../users.interface';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDto } from '../dto/updateUserDto.dto';
import { Op } from 'sequelize';
import { Media } from 'src/feachers/media/media.entity';
import { Phone } from 'src/feachers/phones/phone.entity';
import { Address } from 'src/feachers/addresses/address.entity';
import { UpdateRoleDto } from '../dto/update-role.dto';


@Injectable()
export class UsersService {


    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) { }


    async findById(id: number): Promise<IUser | null> {
        try {
            const user = await this.userModel.findByPk(
                id,
                {
                    include: [{
                        model: Media,
                        attributes: ["id", "storageKey"]
                    }]
                }
            );

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findAll(userQueryDto: UserQueryDto) {
        try {
            const { limit, page, name } = userQueryDto;

            const result = await this.userModel.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${name}%` }
                },
                include: [
                    { model: Media, attributes: ["id", "url"] }
                ],
                attributes: { exclude: ["password"] },
                limit,
                offset: (page - 1) * limit
            });


            return result
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IUser, "image">>): Promise<IUser | null> {
        try {
            const user = await this.userModel.findOne({ where: data });

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneFullData(data: Partial<Omit<IUser, "image" | "addresses" | "phones">>): Promise<Partial<IUser> | null> {
        try {
            const user = await this.userModel.findOne({
                where: data,
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: Media,
                        attributes: ["id", "url", "type"],
                    },
                    {
                        model: Phone,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "userId"]
                        }
                    },
                    {
                        model: Address,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "userId"]
                        }
                    }
                ]
            });

            if (!user) return null


            return user["dataValues"]
        } catch (error) {
            console.log(error)
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

            return await this.findOneFullData({ id })
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
