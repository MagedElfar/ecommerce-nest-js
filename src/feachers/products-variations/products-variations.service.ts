import { UpdateProductVariationDto } from './dto/update-product-variations.dto';
import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductVariations } from './products-variations.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsService } from '../products/services/products.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Attribute } from '../attributes/attribute.entity';
import { AttributeValues } from '../attributes-values/attributes-values.entity';
import { ProductVariationAttributesService } from '../products-variations-attributes/products-variations-attributes.service';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { Product } from '../products/products.entity';
import { Media } from '../media/media.entity';
import { MediaService } from '../media/media.service';

@Injectable()
export class ProductVariationsService {

    constructor(
        @InjectModel(ProductVariations)
        private readonly productVariationModel: typeof ProductVariations,
        @Inject(forwardRef(() => ProductsService))
        private productsService: ProductsService,
        @Inject(forwardRef(() => ProductVariationAttributesService))
        private productVariationAttributesService: ProductVariationAttributesService,
        private sequelize: Sequelize,
        private readonly mediaService: MediaService
    ) { }

    async create(
        createProductVariationDto: CreateProductVariationDto,
        t?: Transaction
    ): Promise<ProductVariations> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const { attributes = [], ...createDto } = createProductVariationDto;

            //check if the product exist if request come from the module controller
            if (!t) {
                const product = await this.productsService.findOneById(createProductVariationDto.productId);

                if (!product) throw new NotFoundException("product not found");
            }

            //create new product variant record in databases
            const variant = await this.productVariationModel.create<ProductVariations>(
                createDto,
                {
                    transaction,
                    include: [{
                        model: AttributeValues,
                        attributes: ["value", "id"],
                        through: { attributes: [] },
                        include: [
                            {
                                model: Attribute,
                                attributes: ["id", "name"],
                            }
                        ]
                    }],
                }
            )

            // add attributes in case the attribute founds
            if (attributes && attributes.length > 0) {

                const attrs = await Promise.all(attributes.map(async (attr) => {
                    return await this.productVariationAttributesService.create(
                        {
                            ...attr,
                            productVariationId: variant["dataValues"].id
                        },
                        transaction
                    )
                }))
            }


            if (!t) {
                await transaction.commit();
                return await this.findOneFullData({ id: variant["dataValues"].id })
            }

            return variant;

        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }

    async findOneById(
        id: number,
        t?: Transaction
    ): Promise<ProductVariations | null> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const productVariant = await this.productVariationModel.findByPk(
                id,

                {
                    include: [
                        {
                            model: Product,
                            attributes: ["id", "price", "name"],
                        },
                        {
                            model: Media,
                            attributes: ["id", "storageKey"],
                            through: { attributes: [] }
                        }
                    ],
                    transaction
                }
            );

            if (!productVariant) return null

            if (!t) await transaction.commit();

            return productVariant["dataValues"];

        } catch (error) {
            await transaction.rollback();
            throw error
        }
    }

    async findOneFullData(data: Partial<Omit<ProductVariations, "attributes">>): Promise<ProductVariations | null> {
        try {

            const productVariant = await this.productVariationModel.findOne({
                where: data,
                include: [
                    {
                        model: Media,
                        attributes: ["id", "url"],
                        through: { attributes: ["id"] }
                    },
                    {
                        model: AttributeValues,
                        attributes: ["value", "id"],
                        through: { attributes: ["id"] },
                        include: [
                            {
                                model: Attribute,
                                attributes: ["id", "name"],
                            }
                        ]
                    }
                ],
            });

            if (!productVariant) throw new NotFoundException()

            return productVariant["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(
        id: number,
        updateProductVariationDto: UpdateProductVariationDto,
        t?: Transaction
    ) {
        const transaction = t || await this.sequelize.transaction()
        try {
            const variant = await this.findOneById(id);

            if (!variant) throw new NotFoundException();

            await this.productVariationModel.update(updateProductVariationDto, {
                where: { id },
                transaction
            });


            if (!t) await transaction.commit()
            return {
                ...variant,
                ...updateProductVariationDto
            }
        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }

    async delete(id: number) {
        const transaction = await this.sequelize.transaction()
        try {
            const variant = await this.findOneById(id);

            if (!variant) throw new NotFoundException();

            const images = variant.images;

            await Promise.all(images.map(async image => {
                await this.mediaService.delete(image.id)
            }))

            await this.productVariationModel.destroy({
                where: { id },
                transaction
            });

            await transaction.commit();
            return;
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}


