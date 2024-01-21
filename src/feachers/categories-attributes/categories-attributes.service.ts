import { CategoriesService } from './../categories/services/categories.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryAttribute } from './entities/categories-attributes.entity';
import { CreateCategoryAttributesDto } from './dto/create-category_attributes.dto';
import { AttributeValuesService } from '../attributes-values/attributes-values.service';
import { ICategoryAttribute } from './interfaces/category-attribute.interface';

@Injectable()
export class CategoriesAttributeService {
    constructor(
        @InjectModel(CategoryAttribute)
        private readonly CategoryAttributeModelModel: typeof CategoryAttribute,
        private readonly categoriesService: CategoriesService,
        private readonly attributeValuesService: AttributeValuesService,
    ) { }



    async findOne(
        data: ICategoryAttribute,

    ): Promise<CategoryAttribute | null> {

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
    ): Promise<CategoryAttribute> {

        try {

            const { attributeId, categoryId } = createCategoryAttributesDto;

            const category = await this.categoriesService.findOneById(categoryId)

            if (!category)
                throw new NotFoundException("category not exist")

            const value = await this.attributeValuesService.findOneById(attributeId)

            if (!value)
                throw new NotFoundException("attribute value not exist")

            //check if attribute already assign to that variant
            let categoryAttribute = await this.findOne(
                {
                    categoryId,
                    attributeId
                },
            )

            if (categoryAttribute) throw new BadRequestException("category shouldn't has duplicate attributes")


            //create new record
            categoryAttribute = await this.CategoryAttributeModelModel.create<CategoryAttribute>(createCategoryAttributesDto)

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
