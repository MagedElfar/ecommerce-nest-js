import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { UploadImageDto } from './dro/uploadImage.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserImages } from './users-images.entity';


@Injectable()
export class UsersImagesService {
    constructor(
        @InjectModel(UserImages)
        private userImagesModel: typeof UserImages,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async create(uploadImageDto: UploadImageDto) {
        try {
            const cloudinary = await this.cloudinaryService.upload({
                file: uploadImageDto.file,
                folder: "users"
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
