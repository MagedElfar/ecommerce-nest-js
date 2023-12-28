import { ProductVariationsService } from './../products-variations/products-variations.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UploadProductVariationImageDto } from './dto/upload-variation-image.dto';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { ProductsFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { ProductVariationImage } from './products-variations-images.entity';
import { IProductVariationImage } from './products-variations-images.interface';

@Injectable()
export class ProductsVariationImageService {
    constructor(
        @InjectModel(ProductVariationImage)
        private readonly productVariationImageModel: typeof ProductVariationImage,
        private readonly productVariationsService: ProductVariationsService,
        private sequelize: Sequelize,
        private readonly cloudinaryService: CloudinaryService,

    ) { }

    async create(uploadProductVariationImageDto: UploadProductVariationImageDto): Promise<IProductVariationImage> {

        let storageKey: string = "";
        let url: string = ""

        try {

            const product = await this.productVariationsService.findOneById(uploadProductVariationImageDto.productVariationId);

            if (!product) throw new NotFoundException("product not found")

            const cloudinary = await this.cloudinaryService.upload({
                file: uploadProductVariationImageDto.file,
                folder: ProductsFolder
            });

            storageKey = cloudinary.public_id
            url = cloudinary.url


            const image = await this.productVariationImageModel.create({
                productVariationId: uploadProductVariationImageDto.productVariationId,
                url: cloudinary.url,
                storageKey
            })

            return image["dataValues"]

        } catch (error) {
            if (storageKey)
                await this.cloudinaryService.delete(storageKey)
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
        const t = await this.sequelize.transaction();
        try {

            const image = await this.findById(id)

            if (!image) throw new NotFoundException();

            const isDelete = await this.productVariationImageModel.destroy({
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
