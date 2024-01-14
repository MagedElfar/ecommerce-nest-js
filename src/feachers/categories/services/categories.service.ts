import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category, CategoryScope } from '../categories.entity';
import * as slugify from "slugify"
import { ICategory } from '../categories.interface';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { CategoryQueryDto } from '../dto/request/category-query.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { MediaService } from 'src/feachers/media/media.service';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category)
        private categoryModel: typeof Category,
        private sequelize: Sequelize,
        private readonly mediaService: MediaService
    ) { }

    async findAll(categoryQueryDto: CategoryQueryDto, scopes: any[] = []): Promise<any> {
        try {
            const { limit, page, name } = categoryQueryDto;

            const rows = await this.categoryModel.scope(scopes).findAll({
                where: {
                    name: { [Op.like]: `%${name}%` },
                },
                group: ['Category.id', "image.id"],
                subQuery: false,
                limit,
                offset: (page - 1) * limit
            });

            const count = await this.categoryModel.count({
                where: {
                    name: { [Op.like]: `%${name}%` },
                },
            });

            return { count, rows }
        } catch (error) {
            throw error
        }
    }


    async findOneById(id: number, scopes: any[] = []): Promise<ICategory | null> {
        try {
            const category = await this.categoryModel.scope(scopes).findByPk(id)

            if (!category) return null;

            return category["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<ICategory, "image" | "subCategories" | "parent">>, scopes: any[] = []): Promise<ICategory | null> {
        try {

            const category = await this.categoryModel.scope(scopes).findOne({
                where: data
            });

            if (!category) return null;

            return category["dataValues"]
        } catch (error) {
            throw error;
        }
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
        try {

            const slug: string = slugify.default(createCategoryDto.name);

            const category = await this.categoryModel.create<Category>({
                ...createCategoryDto,
                slug
            })

            return category["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<ICategory> {
        try {

            let category = await this.findOneById(id);

            if (!category) throw new NotFoundException();

            const slug: string = slugify.default(updateCategoryDto.name);

            await this.categoryModel.update<Category>({
                ...updateCategoryDto,
                slug
            }, { where: { id } })

            category = await this.findOneById(id);

            const attributes = this.mappedCategoryAttributes(category)

            return { ...category, attributes }
        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<void> {

        const t = await this.sequelize.transaction();

        try {

            const category = await this.findOneById(id);

            if (!category) throw new NotFoundException();

            await this.categoryModel.destroy({
                where: { id },
                transaction: t
            });

            if (category.imageId)

                await this.mediaService.delete(category.imageId, t)

            t.commit()
            return;
        } catch (error) {
            t.rollback()
            throw error
        }
    }

    mappedCategoryAttributes(category: ICategory) {
        return category.attributes.reduce((acc: any[], attr: any) => {

            const name = attr.attribute.name
            const index = acc.findIndex((item) => item.name === name)

            if (index === -1) {
                acc.push({
                    name,
                    values: [{
                        id: attr.id,
                        value: attr.value,
                        categoryAttribute: attr.CategoriesAttribute
                    }],
                })
            } else {
                acc[index].values.push({
                    id: attr.id,
                    value: attr.value,
                    categoryAttribute: attr.CategoriesAttribute
                })
            }

            return acc;
        }, []);
    }
}

