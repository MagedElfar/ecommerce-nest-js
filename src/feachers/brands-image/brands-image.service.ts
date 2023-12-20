import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BrandImage } from './brands-image.entity';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { IBrandImage } from './brands-image.interface';
import { BrandsFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { BrandsService } from '../brands/brands.service';
import { UploadBrandImageDto } from './dto/uploadBrandImage.dto';

@Injectable()
export class BrandImageService {
    constructor(
        @InjectModel(BrandImage)
        private readonly branImageModel: typeof BrandImage,
        private readonly brandsService: BrandsService,
        private sequelize: Sequelize,
        private readonly cloudinaryService: CloudinaryService,

    ) { }

    async create(uploadBrandImageDto: UploadBrandImageDto): Promise<IBrandImage> {

        let storageKey: string = "";
        let url: string = ""

        try {

            const category = await this.brandsService.findOneById(uploadBrandImageDto.brandId);

            if (!category) throw new NotFoundException()

            const cloudinary = await this.cloudinaryService.upload({
                file: uploadBrandImageDto.file,
                folder: BrandsFolder
            });

            storageKey = cloudinary.public_id
            url = cloudinary.url

            let image = await this.findOne({ brandId: uploadBrandImageDto.brandId });

            if (image) {

                await this.cloudinaryService.delete(image.storageKey);

                await this.update(image.id, { url, storageKey })

                return {
                    ...image,
                    storageKey,
                    url
                }

            } else {
                console.log("ooo")
                image = await this.branImageModel.create({
                    brandId: uploadBrandImageDto.brandId,
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

    async findById(id: number): Promise<IBrandImage | null> {
        try {
            const image = await this.branImageModel.findByPk(id)

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<IBrandImage, "category">>): Promise<IBrandImage | null> {
        try {
            const image = await this.branImageModel.findOne({ where: data })

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, data: Partial<Omit<IBrandImage, "category">>): Promise<IBrandImage | null> {
        try {

            await this.branImageModel.update(data, { where: { id } })

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

            const isDelete = await this.branImageModel.destroy({
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
