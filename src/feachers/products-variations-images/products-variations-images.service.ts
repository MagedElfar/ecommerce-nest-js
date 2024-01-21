import { ProductVariationsService } from './../products-variations/products-variations.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { ProductVariationImage } from './products-variations-images.entity';
import { IProductVariationImage } from './products-variations-images.interface';
import { MediaService } from '../media/media.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { AssignImageDto } from './dto/assignImage.dto';

@Injectable()
export class ProductsVariationImageService {
    constructor(
        @InjectModel(ProductVariationImage)
        private readonly productVariationImageModel: typeof ProductVariationImage,
        private readonly productVariationsService: ProductVariationsService,
        private sequelize: Sequelize,
        private readonly mediaService: MediaService,

    ) { }

    async create(uploadImageDto: UploadImageDto): Promise<IProductVariationImage> {

        try {

            const product = await this.productVariationsService.findOneById(uploadImageDto.variationId);

            if (!product) throw new NotFoundException("product not found")

            const image = await this.mediaService.create({
                file: uploadImageDto.file,
                folder: ProductsFolder
            })

            const variantImage = await this.productVariationImageModel.create({
                variationId: uploadImageDto.variationId,
                imageId: image.id
            })

            return {
                ...variantImage["dataValues"],
                image
            }

        } catch (error) {
            throw error
        }

    }

    async assign(assignImageDto: AssignImageDto): Promise<IProductVariationImage> {

        try {

            const product = await this.productVariationsService.findOneById(assignImageDto.variationId);

            if (!product) throw new NotFoundException("product not found")

            const image = await this.mediaService.findById(assignImageDto.imageId)

            const variantImage = await this.productVariationImageModel.create({
                variationId: assignImageDto.variationId,
                imageId: image.id
            })

            return {
                ...variantImage["dataValues"],
                image
            }

        } catch (error) {
            throw error
        }

    }

    async findById(id: number): Promise<IProductVariationImage | null> {
        try {
            const image = await this.productVariationImageModel.findByPk(id)

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {

            const image = await this.findById(id)

            if (!image) throw new NotFoundException();

            await this.mediaService.delete(image.imageId)

            return
        } catch (error) {
            throw error
        }
    }



}
