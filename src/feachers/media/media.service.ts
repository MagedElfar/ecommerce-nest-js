import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { Media } from './entities/media.entity';
import { UploadMediaDto } from './dto/uploadMedia.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { MediaQueryDto } from './dto/media.query.dto';
import { MediaRepository } from './media.repository';
import { MediaHelper } from './media.helper';

@Injectable()
export class MediaService {
    constructor(
        private readonly mediaRepository: MediaRepository,
        private readonly mediaHelper: MediaHelper,
        private readonly cloudinaryService: CloudinaryService,
        private sequelize: Sequelize,
    ) { }

    async findAll(mediaQueryDto: MediaQueryDto, scope: string[] = []) {
        try {

            const { limit, page, fromDate, toDate } = mediaQueryDto

            const where = this.mediaHelper.buildDateRangeFilter(fromDate, toDate)

            const result = await this.mediaRepository.findAndCountAll({
                where,
                scope,
                options: { limit, offset: page }
            })

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


            return await this.mediaRepository.create({ url, storageKey })

        } catch (error) {
            if (storageKey)
                await this.cloudinaryService.delete(storageKey)
            throw error
        }
    }

    async findById(id: number): Promise<Media | null> {
        try {
            return await this.mediaRepository.findById(id)
        } catch (error) {
            throw error
        }
    }

    async delete(id: number, t?: Transaction): Promise<void> {
        const transaction = t || await this.sequelize.transaction();

        try {
            const media = await this.findById(id);

            if (!media) throw new NotFoundException()

            await this.mediaRepository.delete(id, { transaction })

            await this.cloudinaryService.delete(media.storageKey);

            if (!t) await transaction.commit();

            return
        } catch (error) {
            transaction.rollback()
            throw error
        }
    }
}
