import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SubCategory } from './sub-categories.entity';
import * as slugify from "slugify"
import { ISubCategory } from './sub-categories.interface';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryQueryDto } from './dto/sub-categoryQuery.dto';
import { Op } from 'sequelize';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { Sequelize } from 'sequelize-typescript';
import { SubCategoryImage } from '../sub-categories-images/sub-categories-images.entity';

@Injectable()
export class SubCategoriesService {
    constructor(
        @InjectModel(SubCategory)
        private subCategoryModel: typeof SubCategory,
        private readonly cloudinaryService: CloudinaryService,
        private sequelize: Sequelize,

    ) { }

    async findAll(subCategoryQueryDto: SubCategoryQueryDto): Promise<ISubCategory[]> {
        try {
            const { limit, page, name } = subCategoryQueryDto;

            const result = await this.subCategoryModel.findAll({
                where: {
                    name: { [Op.like]: `%${name}%` },
                },
                include: [
                    {
                        model: SubCategoryImage,
                        attributes: ["id", "url"]
                    }
                ],
                limit,
                offset: (page - 1) * limit
            });

            const subCategories = result.map(item => item["dataValues"])

            return subCategories
        } catch (error) {
            throw error
        }
    }

    async getCount(subCategoryQueryDto: SubCategoryQueryDto): Promise<number> {
        try {

            const { name } = subCategoryQueryDto;
            const count = await this.subCategoryModel.count({
                where: {
                    name: { [Op.like]: `%${name}%` },

                },
            });

            return count
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<ISubCategory | null> {
        try {
            const subCategory = await this.subCategoryModel.findByPk(id, {
                include: [
                    {
                        model: SubCategoryImage,
                        attributes: ["storageKey"]
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
                        model: SubCategoryImage,
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

            const slug: string = slugify.default(updateSubCategoryDto.name);

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

            if (category.image)
                await this.cloudinaryService.delete(category.image.storageKey)

            t.commit()
            return;
        } catch (error) {
            t.rollback()
            throw error
        }
    }
}