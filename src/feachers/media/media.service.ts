import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { Media } from './entities/media.entity';
import { InjectModel } from '@nestjs/sequelize';
import { UploadMediaDto } from './dto/uploadMedia.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { MediaQueryDto } from './dto/media.query.dto';

@Injectable()
export class MediaService {
    constructor(
        @InjectModel(Media)
        private readonly mediaModel: typeof Media,
        private readonly cloudinaryService: CloudinaryService,
        private sequelize: Sequelize,
    ) { }

    async findAll(mediaQueryDto: MediaQueryDto, scope: string[] = []) {
        try {

            const { limit, page } = mediaQueryDto

            const result = await this.mediaModel.scope(scope).findAndCountAll({
                limit,
                offset: (page - 1) * limit
            });

            return result
        } catch (error) {
            throw error
        }
    }
    async create(uploadMediaDto: UploadMediaDto): Promise<Media> {
        let storageKey: string = "";
        let url: string = ""
        try {

            const cloudinary = await this.cloudinaryService.upload(uploadMediaDto);

            storageKey = cloudinary.public_id
            url = cloudinary.url


            return await this.mediaModel.create({ url, storageKey })

        } catch (error) {
            if (storageKey)
                await this.cloudinaryService.delete(storageKey)
            throw error
        }
    }

    async findById(id: number): Promise<Media | null> {
        try {
            const media = await this.mediaModel.findByPk(id)

            if (!media) return null;

            return media["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async delete(id: number, t?: Transaction): Promise<void> {
        const transaction = t || await this.sequelize.transaction();

        try {
            const media = await this.findById(id);

            if (!media) throw new NotFoundException()

            const isDelete = await this.mediaModel.destroy({
                where: { id },
                transaction
            },)

            await this.cloudinaryService.delete(media.storageKey);

            if (!t) await transaction.commit();

            return
        } catch (error) {
            transaction.rollback()
            throw error
        }
    }
}
