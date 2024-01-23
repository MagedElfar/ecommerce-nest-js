import { MediaService } from 'src/feachers/media/media.service';
import { UploadImageDto } from '../dto/upload.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { USERFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { UsersService } from './users.service';
import { Media } from 'src/feachers/media/entities/media.entity';


@Injectable()
export class UsersImagesService {
    constructor(
        private readonly mediaService: MediaService,
        private readonly usersService: UsersService,
    ) { }

    async upload(uploadImageDto: UploadImageDto): Promise<Media> {

        try {

            const user = await this.usersService.findById(uploadImageDto.userId);

            if (!user) throw new NotFoundException()

            if (user.imageId) {
                await this.mediaService.delete(user.imageId)
            }

            const image = await this.mediaService.create({
                file: uploadImageDto.file,
                folder: USERFolder
            })

            await this.usersService.update(user.id, { imageId: image.id });

            return image
        } catch (error) {
            throw error
        }

    }

    async delete(id: number): Promise<void> {

        try {

            await this.mediaService.delete(id)

            return
        } catch (error) {
            throw error
        }
    }

}
