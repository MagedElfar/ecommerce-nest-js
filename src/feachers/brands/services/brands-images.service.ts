import { BrandsService } from './brands.service';
import { MediaService } from '../../media/media.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadImageDto } from '../dto/upload-image.dto';
import { BrandsFolder, CategoryFolder } from 'src/core/constants';
import { IMedia } from 'src/feachers/media/media.interface';

@Injectable()
export class BrandsImageService {
    constructor(
        private readonly brandsService: BrandsService,
        private readonly mediaService: MediaService
    ) { }

    async upload(uploadImageDto: UploadImageDto): Promise<IMedia> {

        try {

            const brand = await this.brandsService.findOneById(uploadImageDto.brandId);

            if (!brand) throw new NotFoundException()

            if (brand.imageId) {
                await this.mediaService.delete(brand.imageId)
            }

            const image = await this.mediaService.create({
                file: uploadImageDto.file,
                folder: BrandsFolder
            })

            await this.brandsService.update(brand.id, { imageId: image.id });

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
