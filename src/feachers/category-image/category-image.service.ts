import { CategoriesService } from './../categories/categories.service';
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryImage } from './category-image.entity';
import { UploadCategoryImageDto } from './dto/uploadCategoryImage.dto';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { ICategoryImage } from './category-image.interface';
import { CategoryFolder } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CategoryImageService {
    constructor(
        @InjectModel(CategoryImage)
        private readonly categoryImageModel: typeof CategoryImage,
        private readonly categoriesService: CategoriesService,
        private sequelize: Sequelize,
        private readonly cloudinaryService: CloudinaryService,

    ) { }

    async create(uploadCategoryImageDto: UploadCategoryImageDto): Promise<ICategoryImage> {

        let storageKey: string = "";
        let url: string = ""

        try {

            const category = await this.categoriesService.findOneById(uploadCategoryImageDto.categoryId);

            if (!category) throw new NotFoundException()

            const cloudinary = await this.cloudinaryService.upload({
                file: uploadCategoryImageDto.file,
                folder: CategoryFolder
            });

            storageKey = cloudinary.public_id
            url = cloudinary.url

            let image = await this.findOne({ categoryId: uploadCategoryImageDto.categoryId });

            if (image) {

                await this.cloudinaryService.delete(image.storageKey);

                await this.update(image.id, { url, storageKey })

                return {
                    ...image,
                    storageKey,
                    url
                }

            } else {
                image = await this.categoryImageModel.create({
                    categoryId: uploadCategoryImageDto.categoryId,
                    url: cloudinary.url,
                    storageKey
                })

                return image["dataValues"]
            }

        } catch (error) {
            this.cloudinaryService.delete(storageKey)
            throw error
        }

    }

    async findById(id: number): Promise<ICategoryImage | null> {
        try {
            const image = await this.categoryImageModel.findByPk(id)

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<ICategoryImage, "category">>): Promise<ICategoryImage | null> {
        try {
            const image = await this.categoryImageModel.findOne({ where: data })

            if (!image) return null;

            return image["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, data: Partial<Omit<ICategoryImage, "category">>): Promise<ICategoryImage | null> {
        try {

            await this.categoryImageModel.update(data, { where: { id } })

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

            const isDelete = await this.categoryImageModel.destroy({
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
