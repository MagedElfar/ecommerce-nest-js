import { MediaService } from '../../media/media.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadImageDto } from '../dto/upload-image.dto';
import { ProductsFolder } from 'src/core/constants';
import { IMedia } from 'src/feachers/media/media.interface';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsImageService {
    constructor(
        private readonly productsService: ProductsService,
        private readonly mediaService: MediaService
    ) { }

    async upload(uploadImageDto: UploadImageDto): Promise<IMedia> {

        try {

            const product = await this.productsService.findOneById(uploadImageDto.productId);

            if (!product) throw new NotFoundException()

            if (product.imageId) {
                await this.mediaService.delete(product.imageId)
            }

            const image = await this.mediaService.create({
                file: uploadImageDto.file,
                folder: ProductsFolder
            })

            await this.productsService.updated(product.id, { imageId: image.id });

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
