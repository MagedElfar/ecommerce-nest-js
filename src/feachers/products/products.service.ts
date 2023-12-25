import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { IProduct } from './product.interface';
import * as slugify from "slugify"
import { ProductVariationsService } from '../product-variations/product-variations.service';
import { Sequelize } from 'sequelize-typescript';
import { ProductVariations } from '../product-variations/product-variations.entity';
import { AttributeValues } from '../attribute-values/attribute-values.entity';
import { Attribute } from '../attributes/attribute.entity';
import { Category } from '../categories/category.entity';
import { Brand } from '../brands/brands.entity';
import { ProductSubCategory } from '../products-sub-categories/products-sub-category.entity';
import { SubCategory } from '../sub-categories/sub-category.entity';
import { ProductsSubCategoriesService } from '../products-sub-categories/products-sub-categories.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
        @Inject(forwardRef(() => ProductVariationsService))
        private productVariationsService: ProductVariationsService,
        private readonly productsSubCategoriesService: ProductsSubCategoriesService,
        private sequelize: Sequelize,
    ) { }

    async create(
        createProductDto: CreateProductDto
    ): Promise<IProduct> {

        const transaction = await this.sequelize.transaction()

        try {
            const { variations, subCategories = [], ...productDto } = createProductDto;

            const slug: string = slugify.default(createProductDto.name, {
                lower: true,
                trim: true
            })

            //add product
            const product = await this.productModel.create<Product>(
                {
                    ...productDto,
                    slug,
                },
                {
                    transaction,
                    include: [ProductVariations]
                }
            )

            //add product variant
            if (variations && variations.length > 0) {
                await Promise.all(variations.map(async variant => {
                    return await this.productVariationsService.create(
                        {
                            ...variant,
                            productId: product["dataValues"].id
                        },
                        transaction
                    )
                }))
            }

            //add product sub categories if exist
            if (subCategories && subCategories.length > 0) {
                await Promise.all(
                    subCategories.map(async cat => {
                        return await this.productsSubCategoriesService.create(
                            {
                                ...cat,
                                productId: product["dataValues"].id
                            },
                            transaction
                        )
                    })
                )
            }

            await transaction.commit();

            return this.findOneFullData({ id: product["dataValues"].id })
        } catch (error) {
            console.log(error)
            await transaction.rollback()

            if (error instanceof HttpException) throw error

            if (error.parent) throw new InternalServerErrorException(error.parent)


            throw error
        }
    }

    async findOneFullData(data: Partial<Omit<Product, "variations" | "subCategories">>): Promise<IProduct | null> {
        try {
            const product = await this.productModel.findOne({
                where: data,
                include: [
                    {
                        model: SubCategory,
                        attributes: ["name", "id"],
                        through: { attributes: [] },
                    },
                    {
                        model: Category,
                        attributes: ["id", "name"],
                    },
                    {
                        model: Brand,
                        attributes: ["id", "name"],
                    },
                    {
                        model: ProductVariations,
                        include: [
                            {
                                model: AttributeValues,
                                attributes: ["value", "id"],
                                through: { attributes: [] },
                                include: [
                                    {
                                        model: Attribute,
                                        attributes: ["id", "name"],

                                    }
                                ]
                            }
                        ]
                    }
                ]

            })

            if (!product) throw new NotFoundException();

            const attributes = product["variations"]
                .flatMap((variation: any) => variation['attributes'])
                .filter((attribute: any) => attribute['value'])
                .reduce((acc: Record<string, string[]>, attribute: any) => {
                    const attributeName = attribute['attribute']['name'];
                    const attributeValue = attribute['value'];

                    if (!acc[attributeName]) {
                        acc[attributeName] = [];
                    }

                    if (!acc[attributeName].includes(attributeValue)) {
                        acc[attributeName].push(attributeValue);
                    }

                    return acc;
                }, {});

            return { ...product["dataValues"], attributes }
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<IProduct | null> {
        try {
            const product = await this.productModel.findByPk(id)

            if (!product) throw new NotFoundException()

            return product["dataValues"]
        } catch (error) {
            throw error
        }
    }
}
