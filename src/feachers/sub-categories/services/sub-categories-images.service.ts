import { SubCategoriesService } from './sub-categories.service';
import { MediaService } from '../../media/media.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadImageDto } from '../dto/upload-image.dto';
import { CategoryFolder } from 'src/core/constants';
import { IMedia } from 'src/feachers/media/media.interface';

@Injectable()
export class SubCategoryImageService {
    constructor(
        private readonly subCategoriesService: SubCategoriesService,
        private readonly mediaService: MediaService
    ) { }

    async upload(uploadImageDto: UploadImageDto): Promise<IMedia> {

        try {

            const category = await this.subCategoriesService.findOneById(uploadImageDto.subCategoryId);

            if (!category) throw new NotFoundException()

            if (category.imageId) {
                await this.mediaService.delete(category.imageId)
            }

            const image = await this.mediaService.create({
                file: uploadImageDto.file,
                folder: CategoryFolder
            })

            await this.subCategoriesService.update(category.id, { imageId: image.id, name: category.name });

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
