import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductSubCategory } from './entities/products-sub-categories.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { IProductSubCategory } from './interfaces/products-sub-categories.interface';
import { Sequelize } from 'sequelize-typescript';
import { SubCategoriesService } from '../sub-categories/services/sub-categories.service';
import { ProductsService } from '../products/services/products.service';

@Injectable()
export class ProductsSubCategoriesService {
    constructor(
        @InjectModel(ProductSubCategory)
        private readonly productsSubCategoryModel: typeof ProductSubCategory,
        private readonly subCategoryService: SubCategoriesService,
        @Inject(forwardRef(() => ProductsService))
        private readonly productsService: ProductsService,
        private sequelize: Sequelize,
    ) { }

    async findOne(
        data: Partial<Omit<IProductSubCategory, "product" | "subCategory">>
    ): Promise<ProductSubCategory | null> {

        try {

            const productSubCategory = await this.productsSubCategoryModel.findOne({
                where: data,
            });

            if (!productSubCategory) return null;

            return productSubCategory["dataValues"];

        } catch (error) {
            throw error
        }
    }


    async create(
        createProductSubCategoryDto: CreateProductSubCategoryDto,
        t?: Transaction
    ): Promise<ProductSubCategory> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const { subCategoryId, productId } = createProductSubCategoryDto;

            if (!t) {
                const product = await this.productsService.findOneById(productId);

                if (!product) throw new NotFoundException("Product not found")
            }

            const subCategory = await this.subCategoryService.findOneById(subCategoryId);

            if (!subCategory) throw new NotFoundException(`sub category with id = ${subCategory} not exist`)

            //check if attribute already assign to that variant
            let productSubCategory = await this.findOne(
                {
                    subCategoryId,
                    productId
                },
            )

            if (productSubCategory) throw new BadRequestException("product shouldn't has duplicate attributes")


            //create new record
            productSubCategory = await this.productsSubCategoryModel.create(
                createProductSubCategoryDto,
                { transaction }
            )



            if (!t) await transaction.commit()

            return productSubCategory["dataValues"];

        } catch (error) {

            if (!t) await transaction.rollback()

            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const isDeleted = await this.productsSubCategoryModel.destroy({ where: { id } })

            if (!isDeleted) throw new NotFoundException();

            return;
        } catch (error) {
            throw error
        }
    }
}
