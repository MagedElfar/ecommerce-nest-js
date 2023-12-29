import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../products/products.entity';
import { SubCategory } from '../sub-categories/sub-categories.entity';
import { CategoriesAttribute } from './categories-attributes.entity';
import { ICategoryAttribute } from './categories-attributes.interface';
import { CreateCategoryAttributesDto } from './dto/create-category_attributes.dto';

@Injectable()
export class CategoriesAttributeService {
    constructor(
        @InjectModel(CategoriesAttribute)
        private readonly CategoryAttributeModelModel: typeof CategoriesAttribute,
        private sequelize: Sequelize,
    ) { }



    async findOne(
        data: Partial<Omit<ICategoryAttribute, "category" | "attribute">>,

    ): Promise<ICategoryAttribute | null> {

        try {

            const categoryAttribute = await this.CategoryAttributeModelModel.findOne({
                where: data,
            });

            if (!categoryAttribute) return null;


            return categoryAttribute["dataValues"];

        } catch (error) {
            throw error
        }
    }


    async create(
        createCategoryAttributesDto: CreateCategoryAttributesDto,
    ): Promise<ICategoryAttribute> {

        try {

            const { attributeId, categoryId } = createCategoryAttributesDto;

            //check if attribute already assign to that variant
            let categoryAttribute = await this.findOne(
                {
                    categoryId,
                    attributeId
                },
            )

            if (categoryAttribute) throw new BadRequestException("category shouldn't has duplicate attributes")


            //create new record
            categoryAttribute = await this.CategoryAttributeModelModel.create<CategoriesAttribute>(createCategoryAttributesDto)

            return categoryAttribute["dataValues"];

        } catch (error) {

            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const isDeleted = await this.CategoryAttributeModelModel.destroy({ where: { id } })

            if (!isDeleted) throw new NotFoundException();

            return;
        } catch (error) {
            throw error
        }
    }
}
