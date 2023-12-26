import { CreateCategoryDto } from './dto/createCategory.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.entity';
import * as slugify from "slugify"
import { ICategory } from './category.interface';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryQueryDto } from './dto/categoryQuery.dto';
import { Op } from 'sequelize';
import { CategoryImage } from '../category-image/category-image.entity';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { Sequelize } from 'sequelize-typescript';
import { SubCategory } from '../sub-categories/sub-category.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category)
        private categoryModel: typeof Category,
        private readonly cloudinaryService: CloudinaryService,
        private sequelize: Sequelize,
    ) { }

    async findAll(categoryQueryDto: CategoryQueryDto): Promise<ICategory[]> {
        try {
            const { limit, page, name } = categoryQueryDto;

            const result = await this.categoryModel.findAll({
                where: {
                    name: { [Op.like]: `%${name}%` },
                },
                attributes: {
                    include: [
                        [
                            this.sequelize.fn('COUNT', this.sequelize.col('products.id')),
                            'totalProducts'
                        ]
                    ]
                },

                include: [
                    {
                        model: Product,
                        attributes: []
                    },
                    {
                        model: CategoryImage,
                        attributes: ["id", "url"]
                    },
                ],
                group: ['category.id'],
                subQuery: false,
                limit,
                offset: (page - 1) * limit
            });

            const categories = result.map(item => item["dataValues"])

            return categories
        } catch (error) {
            throw error
        }
    }

    async getCount(categoryQueryDto: CategoryQueryDto): Promise<number> {
        try {

            const { name } = categoryQueryDto;
            const count = await this.categoryModel.count({
                where: {
                    name: { [Op.like]: `%${name}%` },
                },
            });

            return count
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<ICategory | null> {
        try {
            const category = await this.categoryModel.findByPk(id, {
                include: [
                    {
                        model: CategoryImage,
                        attributes: ["storageKey"]
                    }
                ],
            })

            if (!category) return null;

            return category["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<ICategory, "image" | "subCategories" | "parent">>): Promise<ICategory | null> {
        try {
            const categoryId = data.id;

            const category = await this.categoryModel.findOne({
                where: { id: categoryId },
                include: [
                    {
                        model: Product,
                        attributes: [],
                    },
                    {
                        model: CategoryImage,
                        attributes: ["id", "url"],
                    },
                    {
                        model: SubCategory,
                        attributes: [
                            "id",
                            "name",
                            "slug",
                            [
                                this.sequelize.literal(
                                    '(SELECT COUNT(*) FROM products_sub_categories WHERE products_sub_categories.subCategoryId = SubCategories.id)'
                                ),
                                'totalProducts',
                            ],
                        ],
                    },
                ],
                attributes: {
                    include: [
                        [
                            this.sequelize.literal('(SELECT COUNT(*) FROM Products WHERE Products.categoryId = Category.id)'),
                            'totalProducts',
                        ],
                    ],
                },
                group: ['Category.id', 'Products.id', 'SubCategories.id'],
            });

            if (!category) return null;

            return category["dataValues"];
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

            return {
                ...category,
                ...updateCategoryDto,
                slug
            }
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Category is already in exist');
            }

            if (error.name === "SequelizeForeignKeyConstraintError") {
                throw new NotFoundException('Parent category not found');
            }
            throw error
        }
    }

    async delete(id: number): Promise<void> {

        const t = await this.sequelize.transaction();

        try {

            const category = await this.findOneById(id);

            if (!category) throw new NotFoundException();

            const isDeleted = await this.categoryModel.destroy({
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

