import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductSubCategory } from './products-sub-category.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { IProductSubCategory } from './products-sub-categories.interface';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../products/product.entity';
import { SubCategory } from '../sub-categories/sub-category.entity';

@Injectable()
export class ProductsSubCategoriesService {
    constructor(
        @InjectModel(ProductSubCategory)
        private readonly productsSubCategoryModel: typeof ProductSubCategory,
        private sequelize: Sequelize,
    ) { }



    async findOne(
        data: Partial<Omit<IProductSubCategory, "product" | "subCategory">>,
        t?: Transaction

    ): Promise<IProductSubCategory | null> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const productSubCategory = await this.productsSubCategoryModel.findOne({
                where: data,
                transaction
            });

            if (!productSubCategory) return null;

            if (!t) await transaction.commit()

            return t ? productSubCategory : productSubCategory["dataValues"];

        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }


    async create(
        createProductSubCategoryDto: CreateProductSubCategoryDto,
        t?: Transaction
    ): Promise<IProductSubCategory> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const { subCategoryId, productId } = createProductSubCategoryDto;

            //check if attribute already assign to that variant
            let productSubCategory = await this.findOne(
                {
                    subCategoryId,
                    productId
                },
                transaction
            )

            if (productSubCategory) throw new BadRequestException("product shouldn't has duplicate attributes")


            //create new record
            productSubCategory = await this.productsSubCategoryModel.create<ProductSubCategory>(
                {
                    productId,
                    subCategoryId
                },
                {
                    include: [
                        {
                            model: Product,
                            attributes: ["id", "name"]
                        },
                        {
                            model: SubCategory,
                            attributes: ["id", "name"]
                        }
                    ],
                    transaction
                }
            )

            if (!t) await transaction.commit()

            return t ? productSubCategory : productSubCategory["dataValues"];

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
