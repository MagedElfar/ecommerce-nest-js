import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CategoryBrand } from './categories-brand.entity';
import { ICategoryBrand } from './categories-brands.interface';
import { CreateCategoryBrandDto } from './dto/request/create-category_attributes.dto';
import { BrandsService } from '../brands/services/brands.service';
import { CategoriesService } from '../categories/services/categories.service';

@Injectable()
export class CategoriesBrandsService {
    constructor(
        @InjectModel(CategoryBrand)
        private readonly CategoryBrandModel: typeof CategoryBrand,
        private readonly categoriesService: CategoriesService,
        private readonly brandsService: BrandsService,
    ) { }



    async findOne(
        data: Partial<Omit<ICategoryBrand, "category" | "brand">>,

    ): Promise<ICategoryBrand | null> {

        try {

            const categoryBrand = await this.CategoryBrandModel.findOne({
                where: data,
            });

            if (!categoryBrand) return null;


            return categoryBrand["dataValues"];

        } catch (error) {
            throw error
        }
    }


    async create(
        createCategoryBrandDto: CreateCategoryBrandDto,
    ): Promise<ICategoryBrand> {

        try {

            const { brandId, categoryId } = createCategoryBrandDto;

            const category = await this.categoriesService.findOneById(categoryId)

            if (!category)
                throw new NotFoundException("category not exist")

            const value = await this.brandsService.findOneById(brandId)

            if (!value)
                throw new NotFoundException("brand not exist")

            //check if attribute already assign to that variant
            let categoryBrand = await this.findOne(
                {
                    categoryId,
                    brandId
                },
            )

            if (categoryBrand) throw new BadRequestException("category shouldn't has duplicate attributes")


            //create new record
            categoryBrand = await this.CategoryBrandModel.create(createCategoryBrandDto)

            return categoryBrand["dataValues"];

        } catch (error) {

            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const isDeleted = await this.CategoryBrandModel.destroy({ where: { id } })

            if (!isDeleted) throw new NotFoundException();

            return;
        } catch (error) {
            throw error
        }
    }
}
