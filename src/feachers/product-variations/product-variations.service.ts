import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductVariations } from './product-variations.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsService } from '../products/products.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { ProductVariationAttributesService } from '../product_variation_attributes/product_variation_attributes.service';
import { AttributeValues } from '../attribute-values/attribute-values.entity';
import { Attribute } from '../attributes/attribute.entity';

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

    ) { }

    async _create(createProductVariationDto: CreateProductVariationDto, t: Transaction): Promise<ProductVariations> {
        try {
            const { attributes: attrs = [], ...createDto } = createProductVariationDto

            const variant = await this.productVariationModel.create<ProductVariations>(
                createDto,
                { transaction: t }
            )

            const attributes: any = [];

            await Promise.all(attrs.map(async (attr) => {
                const attribute = await this.productVariationAttributesService.create(
                    { ...attr, productVariationId: variant["dataValues"].id },
                    t
                )

                attributes.push(attribute)
            }))


            return await this.findOneFullData({ id: variant["dataValues"].id }, t)
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('SKU should be unique');
            }
            throw error
        }
    }

    async create(
        createProductVariationDto: CreateProductVariationDto,
    ): Promise<ProductVariations> {
        const t = await this.sequelize.transaction()
        try {

            const { attributes, ...createDto } = createProductVariationDto

            const product = await this.productsService.findOneById(createProductVariationDto.productId);

            if (!product) throw new NotFoundException("product not found");

            const productVariant = await this._create(createProductVariationDto, t)

            t.commit()

            return productVariant
        } catch (error) {
            t.rollback()
            throw error
        }
    }

    async findOneById(id: number): Promise<ProductVariations | null> {
        try {

            const productVariant = await this.productVariationModel.findByPk(id);

            if (!productVariant) return null

            return productVariant["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('SKU should be unique');
            }
            throw error
        }
    }

    async findOneFullData(
        data: Partial<Omit<ProductVariations, "attributes">>,
        t?: Transaction
    ): Promise<ProductVariations | null> {
        try {

            const productVariant = await this.productVariationModel.findOne({
                where: data,
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
                transaction: t
            });

            if (!productVariant) throw new NotFoundException()

            return productVariant["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('SKU should be unique');
            }
            throw error
        }
    }
}


