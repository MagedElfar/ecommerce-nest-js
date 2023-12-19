import { CloudinaryService } from '../../utility/cloudinary/cloudinary.service';
import { UploadImageDto } from './dto/uploadImage.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserImages } from './users-images.entity';
import { IUserImage } from './users-images.interface';
import { USERFolder } from 'src/core/constants';


@Injectable()
export class UsersImagesService {
    constructor(
        @InjectModel(UserImages)
        private userImagesModel: typeof UserImages,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async create(uploadImageDto: UploadImageDto): Promise<IUserImage> {
        try {
            const cloudinary = await this.cloudinaryService.upload({
                file: uploadImageDto.file,
                folder: USERFolder
            });

            const image = await this.userImagesModel.create({
                userId: uploadImageDto.userId,
                url: cloudinary.url,
                storageKey: cloudinary.public_id
            })

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }
}
