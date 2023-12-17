import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UserEntity } from './user.entity';
import { IUser } from './users.interface';
import { InjectModel } from '@nestjs/sequelize';
import { UserImages } from 'src/users-images/users-images.entity';
import { UpdateUserDto } from './dto/updateUserDto.dto';


@Injectable()
export class UsersService {


    constructor(
        @InjectModel(UserEntity)
        private userModel: typeof UserEntity,
    ) { }

    // findAll() {
    // }

    async findOne(data: Partial<IUser>): Promise<UserEntity | null> {
        try {
            const user = await this.userModel.findOne({ where: data });

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneFullData(data: Partial<IUser>): Promise<Partial<UserEntity> | null> {
        try {
            const user = await this.userModel.findOne({
                where: data,
                include: [{
                    model: UserImages
                }]
            });

            if (!user) return null

            const { password, ...result } = user["dataValues"];

            return result
        } catch (error) {
            throw error
        }
    }


    async findById(id: number): Promise<UserEntity | null> {
        try {
            const user = await this.userModel.findByPk(id);

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        try {
            const user = await this.userModel.create<UserEntity>(createUserDto);

            return user["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Email address is already in use');
            }
            throw error
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<Partial<UserEntity>> {
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
