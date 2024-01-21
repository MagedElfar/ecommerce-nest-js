import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryBrand } from './entities/categories-brand.entity';
import { CreateCategoryBrandDto } from './dto/create-category_brand.dto';
import { BrandsService } from '../brands/services/brands.service';
import { CategoriesService } from '../categories/services/categories.service';
import { ICategoryBrand } from './interfaces/category-brand.interface';

@Injectable()
export class CategoriesBrandsService {
    constructor(
        @InjectModel(CategoryBrand)
        private readonly CategoryBrandModel: typeof CategoryBrand,
        private readonly categoriesService: CategoriesService,
        private readonly brandsService: BrandsService,
    ) { }



    async findOne(
        data: ICategoryBrand,

    ): Promise<CategoryBrand | null> {

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
    ): Promise<CategoryBrand> {

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
