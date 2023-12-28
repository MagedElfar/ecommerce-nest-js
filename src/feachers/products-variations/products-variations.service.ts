import { UpdateProductVariationDto } from './dto/update-product-variations.dto';
import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductVariations } from './products-variations.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsService } from '../products/products.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Attribute } from '../attributes/attribute.entity';
import { AttributeValues } from '../attributes-values/attributes-values.entity';
import { ProductVariationAttributesService } from '../products-variations-attributes/products-variations-attributes.service';

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
                { transaction }
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
            });

            if (!productVariant) throw new NotFoundException()

            return productVariant["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateProductVariationDto: UpdateProductVariationDto) {
        try {
            const variant = await this.findOneById(id);

            if (!variant) throw new NotFoundException();

            await this.productVariationModel.update(updateProductVariationDto, { where: { id } });

            return {
                ...variant,
                ...updateProductVariationDto
            }
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            const variant = await this.findOneById(id);

            if (!variant) throw new NotFoundException();

            await this.productVariationModel.destroy({ where: { id } });

            return;
        } catch (error) {
            throw error
        }
    }
}

