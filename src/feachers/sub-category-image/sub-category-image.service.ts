import { SubCategoriesService } from './../sub-categories/sub-categories.service';
import { CategoriesService } from '../categories/categories.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubCategoryImage } from './sub-category-image.entity';
import { UploadCategoryImageDto } from './dto/uploadCategoryImage.dto';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { ISubCategoryImage } from './sub-category-image.interface';
import { CategoryFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SubCategoryImageService {
    constructor(
        @InjectModel(SubCategoryImage)
        private readonly subCategoryImageModel: typeof SubCategoryImage,
        private readonly categoriesService: SubCategoriesService,
        private sequelize: Sequelize,
        private readonly cloudinaryService: CloudinaryService,

    ) { }

    async create(uploadSubCategoryImageDto: UploadCategoryImageDto): Promise<ISubCategoryImage> {

        let storageKey: string = "";
        let url: string = ""

        try {

            const category = await this.categoriesService.findOneById(uploadSubCategoryImageDto.categoryId);

            if (!category) throw new NotFoundException()

            const cloudinary = await this.cloudinaryService.upload({
                file: uploadSubCategoryImageDto.file,
                folder: CategoryFolder
            });

            storageKey = cloudinary.public_id
            url = cloudinary.url

            let image = await this.findOne({ subCategoryId: uploadSubCategoryImageDto.categoryId });

            if (image) {

                await this.cloudinaryService.delete(image.storageKey);

                await this.update(image.id, { url, storageKey })

                return {
                    ...image,
                    storageKey,
                    url
                }

            } else {
                image = await this.subCategoryImageModel.create({
                    subCategoryId: uploadSubCategoryImageDto.categoryId,
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

    async findById(id: number): Promise<ISubCategoryImage | null> {
        try {
            const image = await this.subCategoryImageModel.findByPk(id)

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<ISubCategoryImage, "category">>): Promise<ISubCategoryImage | null> {
        try {
            const image = await this.subCategoryImageModel.findOne({ where: data })

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, data: Partial<Omit<ISubCategoryImage, "category">>): Promise<ISubCategoryImage | null> {
        try {

            await this.subCategoryImageModel.update(data, { where: { id } })

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

            const isDelete = await this.subCategoryImageModel.destroy({
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
