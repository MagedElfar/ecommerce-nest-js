import { CreateSubCategoryDto } from '../dto/create-sub-category.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubCategory } from '../sub-categories.entity';
import * as slugify from "slugify"
import { ISubCategory } from '../sub-categories.interface';
import { UpdateSubCategoryDto } from '../dto/update-sub-category.dto';
import { SubCategoryQueryDto } from '../dto/sub-categoryQuery.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { MediaService } from 'src/feachers/media/media.service';
import { Media } from 'src/feachers/media/media.entity';

@Injectable()
export class SubCategoriesService {
    constructor(
        @InjectModel(SubCategory)
        private subCategoryModel: typeof SubCategory,
        private readonly mediaService: MediaService,
        private sequelize: Sequelize,

    ) { }

    async findAll(subCategoryQueryDto: SubCategoryQueryDto): Promise<any> {
        try {
            const { limit, page, name, ...data } = subCategoryQueryDto;

            const subCategories = await this.subCategoryModel.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${name}%` },
                    ...data
                },
                include: [
                    {
                        model: Media,
                        attributes: ["id", "url"]
                    }
                ],
                limit,
                offset: (page - 1) * limit
            });


            return subCategories
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<ISubCategory | null> {
        try {
            const subCategory = await this.subCategoryModel.findByPk(id, {
                include: [
                    {
                        model: Media,
                        attributes: ["id", "storageKey"]
                    }
                ],
            })

            if (!subCategory) return null;

            return subCategory["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<ISubCategory, "image" | "subCategories" | "parent">>): Promise<ISubCategory | null> {
        try {
            const subCategory = await this.subCategoryModel.findOne({
                where: data,
                include: [
                    {
                        model: Media,
                        attributes: ["id", "url"]
                    },
                ],
            })

            if (!subCategory) return null;

            return subCategory["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async create(createSubCategoryDto: CreateSubCategoryDto): Promise<ISubCategory> {
        try {

            const slug: string = slugify.default(createSubCategoryDto.name);

            const subCategory = await this.subCategoryModel.create<SubCategory>({
                ...createSubCategoryDto,
                slug
            })

            return subCategory["dataValues"]
        } catch (error) {

            throw error
        }
    }

    async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto): Promise<ISubCategory> {
        try {

            let subCategory = await this.findOneById(id);

            if (!subCategory) throw new NotFoundException();


            const slug: string = slugify.default(updateSubCategoryDto?.name || subCategory.name);

            await this.subCategoryModel.update<SubCategory>({
                ...updateSubCategoryDto,
                slug
            }, { where: { id } })

            return {
                ...subCategory,
                ...updateSubCategoryDto,
                slug
            }
        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<void> {

        const t = await this.sequelize.transaction();

        try {

            const category = await this.findOneById(id);

            if (!category) throw new NotFoundException();

            const isDeleted = await this.subCategoryModel.destroy({
                where: { id },
                transaction: t
            });

            if (!isDeleted) throw new NotFoundException();

            if (category.imageId)
                await this.mediaService.delete(category.imageId)

            t.commit()
            return;
        } catch (error) {
            t.rollback()
            throw error
        }
    }
}
