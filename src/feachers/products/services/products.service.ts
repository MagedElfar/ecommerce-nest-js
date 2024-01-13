import { MediaService } from 'src/feachers/media/media.service';
import { UpdateProductDto } from '../dto/request/update-product.dto';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { ConflictException, HttpException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductScop } from '../products.entity';
import { IProduct } from '../products.interface';
import * as slugify from "slugify"
import { Sequelize } from 'sequelize-typescript';
import { SubCategory } from '../../sub-categories/sub-categories.entity';
import { ProductsSubCategoriesService } from '../../products-sub-categories/products-sub-categories.service';
import { Includeable, Op, WhereOptions, where } from 'sequelize';
import { ProductQueryDto } from '../dto/request/product-query.dto';
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
        @Inject(forwardRef(() => ProductsSubCategoriesService))
        private readonly productsSubCategoriesService: ProductsSubCategoriesService,
        private sequelize: Sequelize,
        private mediaService: MediaService
    ) { }

    private filterCriteria(filterOptions: Partial<Omit<ProductQueryDto, "limit" | "offset">>): {
        where: WhereOptions<Product>,
        include?: Includeable[]
    } {

        const where: WhereOptions<Product> = {}

        const include: Includeable[] = [{
            model: Media
        }]


        //filler by name if exist in query
        if (filterOptions.name) where.name = { [Op.like]: `%${filterOptions.name}%` };

        //filler by categoryId if exist in query
        if (filterOptions.categoryId) where.categoryId = filterOptions.categoryId;

        //filler by brandId if exist in query
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


        //filler by subcategoryId if exist in query
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

        //filler by attribute if exist in query
        if (filterOptions.attributes) {
            include.push({
                model: ProductVariations,
                attributes: [],
                where: {},
                include: [
                    {
                        model: AttributeValues,
                        where: { id: { [Op.in]: filterOptions.attributes } },
                        attributes: [],
                        through: { where: { attrId: { [Op.in]: filterOptions.attributes } } }
                    }
                ],
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
            const {
                variations: ProVariations,
                subCategories = [],
                ...productDto
            } = createProductDto;

            //1-check if product exist
            const isProduct = await this.findOne({ name: createProductDto.name })

            if (isProduct) throw new ConflictException(`product with name "${createProductDto.name}" already exist`)

            //2-create product slug
            const slug: string = slugify.default(createProductDto.name, {
                lower: true,
                trim: true
            })

            //3-create new product in database
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


            //4-create new product variations if exist
            if (ProVariations && ProVariations.length > 0) {

                await Promise.all(ProVariations.map(async variant => {
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

            console.log("cat ...")


            await transaction.commit();

            console.log("cat ...")

            return await this.fullData(product["dataValues"].id)
        } catch (error) {
            console.log(error)
            await transaction.rollback()

            if (error instanceof HttpException) throw error

            throw error
        }
    }

    async findOneById(id: number, scopes: string[] = []): Promise<IProduct | null> {
        try {

            const product = await this.productModel.scope(scopes).findByPk(id)

            if (!product) throw new NotFoundException()

            return product["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<Product, "variations" | "subCategories">>, scopes: string[] = []): Promise<IProduct | null> {
        try {

            const product = await this.productModel.scope(scopes).findOne({ where: data })

            if (!product) return null

            return product["dataValues"]
        } catch (error) {
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

            return await this.fullData(id)

        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        const transaction = await this.sequelize.transaction()
        try {

            const product = await this.findOneById(id, [
                ProductScop.WITH_MEDIA, ProductScop.WITH_VARIATION
            ]);

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

    async fullData(id: number) {
        try {
            const product = await this.findOneById(id, Object.values(ProductScop));

            if (!product) throw new NotFoundException("Product not exist")

            const attributes = this.mappedProductAttributes(product)

            return {
                ...product,
                attributes
            }
        } catch (error) {
            throw error
        }
    }

    private mappedProductAttributes(product: IProduct) {

        return product["variations"]
            .flatMap((variation: any) => variation['attributes'])
            .filter((attribute: any) => attribute['value']).reduce((acc: any[], attr: any) => {

                const name = attr.attribute.name
                const index = acc.findIndex((item) => item.name === name)

                if (index === -1) {
                    acc.push({
                        name,
                        values: [{
                            id: attr.id,
                            value: attr.value,
                            // categoryAttribute: attr.CategoriesAttribute
                        }],
                    })
                } else {
                    acc[index].values.push({
                        id: attr.id,
                        value: attr.value,
                        // categoryAttribute: attr.CategoriesAttribute
                    })
                }

                return acc;
            }, []);

    }
}
