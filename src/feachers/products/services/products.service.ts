import { MediaService } from 'src/feachers/media/media.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { HttpException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../products.entity';
import { IProduct } from '../products.interface';
import * as slugify from "slugify"
import { Sequelize } from 'sequelize-typescript';
import { Attribute } from '../../attributes/attribute.entity';
import { Category } from '../../categories/categories.entity';
import { Brand } from '../../brands/brands.entity';
import { SubCategory } from '../../sub-categories/sub-categories.entity';
import { ProductsSubCategoriesService } from '../../products-sub-categories/products-sub-categories.service';
import { Includeable, Op, WhereOptions, where } from 'sequelize';
import { ProductQueryDto } from '../dto/product-query.dto';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { AttributeValues } from '../../attributes-values/attributes-values.entity';
import { ProductVariations } from '../../products-variations/products-variations.entity';
import { ProductVariationsService } from '../../products-variations/products-variations.service';
import { Media } from 'src/feachers/media/media.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
        @Inject(forwardRef(() => ProductVariationsService))
        private productVariationsService: ProductVariationsService,
        private readonly productsSubCategoriesService: ProductsSubCategoriesService,
        private sequelize: Sequelize,
        private mediaService: MediaService
    ) { }

    private filterCriteria(filterOptions: Partial<Omit<ProductQueryDto, "limit" | "offset">>): {
        where: WhereOptions<Product>,
        include?: Includeable[]
    } {
        const options = {}

        const where: WhereOptions<Product> = {}

        const include: Includeable[] = []


        if (filterOptions.name) where.name = { [Op.like]: `%${filterOptions.name}%` };

        if (filterOptions.categoryId) where.categoryId = filterOptions.categoryId;

        if (filterOptions.brands) where.brandId = { [Op.in]: filterOptions.brands };

        // Add price range filtering
        if (filterOptions.minPrice || filterOptions.maxPrice) {
            where.price = {};

            if (filterOptions.minPrice) {
                where.price[Op.gte] = filterOptions.minPrice;
            }

            if (filterOptions.maxPrice) {
                where.price[Op.lte] = filterOptions.maxPrice;
            }
        }

        if (filterOptions.subCategoryId) {
            include.push({
                model: SubCategory,
                attributes: [],
                through: { attributes: [] }, // Exclude the join table from the attributes
                where: {
                    id: filterOptions.subCategoryId,
                },
            },)
        }

        if (filterOptions.attributes) {
            include.push({
                model: ProductVariations,
                attributes: [],
                where: {},
                include: [{
                    model: AttributeValues,
                    where: { id: { [Op.in]: filterOptions.attributes } },
                    attributes: [],
                    through: { where: { attrId: { [Op.in]: filterOptions.attributes } } }
                }],
            });
        }
        return {
            where,
            include
        }

    }

    async findAll(productQueryDto: ProductQueryDto): Promise<any> {
        try {
            const { limit, page, ...filterOptions } = productQueryDto;

            const options = this.filterCriteria(filterOptions)

            const result = await this.productModel.findAndCountAll({

                ...options,
                limit,
                offset: (page - 1) * limit,
                distinct: true,

            });

            // const products = result.map(item => item["dataValues"])

            return result
        } catch (error) {
            throw error
        }
    }

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

            throw error
        }
    }

    async updated(id: number, updateProductDto: UpdateProductDto): Promise<IProduct> {
        try {
            let product = await this.findOneById(id);

            if (!product) throw new NotFoundException("product not found");

            if (updateProductDto.name) {
                const slug: string = slugify.default(updateProductDto.name, {
                    lower: true,
                    trim: true
                })

                updateProductDto["slug"] = slug
            }

            await this.productModel.update(updateProductDto, { where: { id } })

            return {
                ...product,
                ...updateProductDto
            }

        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        const transaction = await this.sequelize.transaction()
        try {

            const product = await this.findOneById(id);

            if (!product) throw new NotFoundException("product not found");

            //delete product from database
            const isDeleted = await this.productModel.destroy({ where: { id }, transaction });

            if (!isDeleted) throw new NotFoundException("product not found");

            const imagIds = []

            //get product image storage key and push it in key array
            imagIds.push(product.imageId)

            //get product variations images storage key and push it in key array
            product.variations.forEach(variation => {
                variation.images.forEach(image => imagIds.push(image.id))
            })

            // delete all image from the cloud
            await Promise.all(imagIds.map(async (id) => {

                if (!id) return;
                await this.mediaService.delete(id, transaction);
                return;
            }))

            await transaction.commit()
            return;

        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    async findOneFullData(data: Partial<Omit<Product, "variations" | "subCategories">>): Promise<IProduct | null> {
        try {
            const product = await this.productModel.findOne({
                where: data,
                include: [
                    {
                        model: Media,
                        attributes: ["url", "id"]
                    },
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
                                model: Media,
                                attributes: ["id", "url"],
                                through: { attributes: [] }
                            },
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

            const product = await this.productModel.findByPk(
                id,
                {
                    include: [
                        {
                            model: Media,
                            attributes: ["id", "storageKey"]
                        },
                        {
                            model: ProductVariations,
                            attributes: ["id"],
                            include: [
                                {
                                    model: Media,
                                    attributes: ["id", "url"],
                                    through: { attributes: [] }
                                },
                            ]
                        }
                    ]
                }
            )

            if (!product) throw new NotFoundException()

            return product["dataValues"]
        } catch (error) {
            throw error
        }
    }
}