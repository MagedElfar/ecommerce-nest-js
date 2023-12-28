import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UploadProductImageDto } from './dto/upload-variation-image.dto';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { ProductsFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { ProductImage } from './products-variations-images.entity';
import { IProductImage } from './products-variations-images.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductsImageService {
    constructor(
        @InjectModel(ProductImage)
        private readonly productImageModel: typeof ProductImage,
        private readonly productsService: ProductsService,
        private sequelize: Sequelize,
        private readonly cloudinaryService: CloudinaryService,

    ) { }

    async create(uploadProductImageDto: UploadProductImageDto): Promise<IProductImage> {

        let storageKey: string = "";
        let url: string = ""

        try {

            const product = await this.productsService.findOneById(uploadProductImageDto.productId);

            if (!product) throw new NotFoundException("product not found")

            const cloudinary = await this.cloudinaryService.upload({
                file: uploadProductImageDto.file,
                folder: ProductsFolder
            });

            storageKey = cloudinary.public_id
            url = cloudinary.url

            let image = await this.findOne({ productId: uploadProductImageDto.productId });

            if (image) {

                await this.cloudinaryService.delete(image.storageKey);

                await this.update(image.id, { url, storageKey })

                return {
                    ...image,
                    storageKey,
                    url
                }

            } else {
                image = await this.productImageModel.create({
                    productId: uploadProductImageDto.productId,
                    url: cloudinary.url,
                    storageKey
                })

                return image["dataValues"]
            }

        } catch (error) {
            if (storageKey)
                await this.cloudinaryService.delete(storageKey)
            throw error
        }

    }

    async findById(id: number): Promise<IProductImage | null> {
        try {
            const image = await this.productImageModel.findByPk(id)

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IProductImage, "category">>): Promise<IProductImage | null> {
        try {
            const image = await this.productImageModel.findOne({ where: data })

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, data: Partial<Omit<IProductImage, "category">>): Promise<IProductImage | null> {
        try {

            await this.productImageModel.update(data, { where: { id } })

            return
        } catch (error) {
            throw error
        }
    }


    async delete(id: number): Promise<void> {
        const t = await this.sequelize.transaction();

        try {

            const image = await this.findById(id)

            if (!image) throw new NotFoundException();

            const isDelete = await this.productImageModel.destroy({
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
