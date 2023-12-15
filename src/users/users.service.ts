import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { User } from './user.entity';
import { IUser } from './users.interface';
import { InjectModel } from '@nestjs/sequelize';


@Injectable()
export class UsersService {


    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    // findAll() {
    // }

    async findOne(data: Partial<IUser>): Promise<User | null> {
        try {
            const user = await this.userModel.findOne({ where: data });

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            const user = await this.userModel.findByPk(id);

            if (!user) return null

            return user["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = await this.userModel.create<User>(createUserDto);

            return user["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new HttpException('Email address is already in use', HttpStatus.BAD_REQUEST);
            }
            throw error
        }
    }

}
