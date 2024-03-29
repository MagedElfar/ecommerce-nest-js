import { UpdateProductVariationDto } from './dto/update-product-variations.dto';
import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductVariations, VariationScope } from './entities/products-variations.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsService } from '../products/services/products.service';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { Attribute } from '../attributes/entities/attribute.entity';
import { AttributeValue } from '../attributes-values/entities/attribute-value.entity';
import { ProductVariationAttributesService } from '../products-variations-attributes/products-variations-attributes.service';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { Product } from '../products/entities/products.entity';
import { Media } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';
import { IProductVariation } from './interfaces/products-variations.interface';
import { VariationQueryDto } from './dto/product-variation-query.dto';

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


    async findAll(variationQueryDto: VariationQueryDto, scopes: string[] = []) {
        try {
            const { limit, page, searchTerm } = variationQueryDto;

            const variations = await this.productVariationModel.scope(scopes).findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${searchTerm}%` } },
                        { sku: { [Op.iLike]: `%${searchTerm}%` } },
                    ],
                },
                limit,
                offset: (page - 1) * limit
            });

            return variations

        } catch (error) {
            throw error
        }
    }

    async create(
        createProductVariationDto: CreateProductVariationDto,
        t?: Transaction
    ): Promise<ProductVariations> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const { attributes = [], ...createDto } = createProductVariationDto;


            //1-check if the product exist if request come from the module controller
            if (!t) {
                const product = await this.productsService.findOneById(createProductVariationDto.productId);

                if (!product) throw new NotFoundException("product not found");
            }


            //3-check if variation sku exist
            let variant = await this.findOne({ sku: createProductVariationDto.sku })

            if (variant) throw new ConflictException(`variant with sku "${createProductVariationDto.sku}" already exist`);

            //4-create new product variant record in databases
            variant = await this.productVariationModel.create<ProductVariations>(
                createDto,
                {
                    transaction,
                    include: [{
                        model: AttributeValue,
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

            //5-add attributes in case the attribute founds
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
                return await this.findOneById(variant["dataValues"].id, [
                    VariationScope.WITH_PRODUCT,
                    VariationScope.WITH_MEDIA,
                    VariationScope.WITH_ATTRIBUTES
                ])
            }

            return variant["dataValues"];

        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }

    async findOneById(
        id: number,
        scopes: string[] = []
    ): Promise<ProductVariations | null> {

        try {

            const productVariant = await this.productVariationModel.scope(scopes).findByPk(id);

            if (!productVariant) return null


            return productVariant["dataValues"];

        } catch (error) {
            throw error
        }
    }

    async findOne(
        data: Omit<IProductVariation, "product">,
        scopes: string[] = []
    ): Promise<ProductVariations | null> {
        try {

            const productVariant = await this.productVariationModel.scope(scopes).findOne({ where: data });

            if (!productVariant) return null;

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

            return await this.findOneById(id)
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


