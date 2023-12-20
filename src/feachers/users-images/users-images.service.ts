import { CloudinaryService } from '../../utility/cloudinary/cloudinary.service';
import { UploadImageDto } from './dto/uploadImage.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserImages } from './users-images.entity';
import { IUserImage } from './users-images.interface';
import { USERFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { UsersService } from '../users/users.service';


@Injectable()
export class UsersImagesService {
    constructor(
        @InjectModel(UserImages)
        private userImagesModel: typeof UserImages,
        private readonly usersService: UsersService,
        private readonly cloudinaryService: CloudinaryService,
        private sequelize: Sequelize,
    ) { }

    async create(uploadImageDto: UploadImageDto): Promise<IUserImage> {

        let storageKey: string = "";
        let url: string = ""

        try {

            const user = await this.usersService.findById(uploadImageDto.userId);

            if (!user) throw new NotFoundException()

            const cloudinary = await this.cloudinaryService.upload({
                file: uploadImageDto.file,
                folder: USERFolder
            });

            storageKey = cloudinary.public_id
            url = cloudinary.url

            let image = await this.findOne({ userId: uploadImageDto.userId });

            if (image) {

                await this.cloudinaryService.delete(image.storageKey);

                await this.update(image.id, { url, storageKey })

                return {
                    ...image,
                    storageKey,
                    url
                }

            } else {
                image = await this.userImagesModel.create({
                    userId: uploadImageDto.userId,
                    url: cloudinary.url,
                    storageKey
                })

                return image["dataValues"]
            }

        } catch (error) {
            if (storageKey)
                await this.cloudinaryService.delete(storageKey)

            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('User already have profile image delete it');
            }

            throw error
        }

    }

    async findById(id: number): Promise<IUserImage | null> {
        try {
            const image = await this.userImagesModel.findByPk(id)

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IUserImage, "user">>): Promise<IUserImage | null> {
        try {
            const image = await this.userImagesModel.findOne({ where: data })

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, data: Partial<Omit<IUserImage, "user">>): Promise<IUserImage | null> {
        try {

            await this.userImagesModel.update(data, { where: { id } })

            return
        } catch (error) {
            throw error
        }
    }


    async delete(id: number, userId: number): Promise<void> {
        const t = await this.sequelize.transaction();

        try {

            const image = await this.findById(id)

            if (!image) throw new NotFoundException();

            if (userId !== image.userId) throw new ForbiddenException()

            const isDelete = await this.userImagesModel.destroy({
                where: { id },
                transaction: t
            },)

            if (!isDelete) throw new NotFoundException();

            await this.cloudinaryService.delete(image.storageKey)


            t.commit()
            return
        } catch (error) {
            t.rollback()
            throw error
        }
    }

}
