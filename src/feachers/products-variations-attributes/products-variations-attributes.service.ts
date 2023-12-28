import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductVariationAttribute } from './products-variations-attributes.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IProductVariationAttributes } from './products-variations-attributes.interface';
import { CreateProductAttributesDto } from './dto/create-product_variation_attributes.dto';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AttributeValuesService } from '../attributes-values/attributes-values.service';
import { ProductVariationsService } from '../products-variations/products-variations.service';


@Injectable()
export class ProductVariationAttributesService {
    constructor(
        @InjectModel(ProductVariationAttribute)
        private readonly productAttributeModel: typeof ProductVariationAttribute,
        @Inject(forwardRef(() => ProductVariationsService))
        private readonly productVariationsService: ProductVariationsService,
        private readonly attributeValuesService: AttributeValuesService,
        private sequelize: Sequelize,
    ) { }

    async findOne(
        data: Partial<Omit<IProductVariationAttributes, "proVar" | "attribute">>,
        t?: Transaction

    ): Promise<IProductVariationAttributes | null> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const productAttribute = await this.productAttributeModel.findOne({
                where: data,
                transaction
            });

            if (!productAttribute) return null;

            if (!t) await transaction.commit()

            return t ? productAttribute : productAttribute["dataValues"];

        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }


    async create(
        createProductAttributesDto: CreateProductAttributesDto,
        t?: Transaction
    ): Promise<IProductVariationAttributes> {

        const transaction = t || await this.sequelize.transaction();

        try {

            const { attrId, productVariationId } = createProductAttributesDto;

            //check if the variant exist if request come from the module controller
            if (!t) {
                const variant = await this.productVariationsService.findOneById(
                    productVariationId,
                    transaction
                );
                if (!variant) throw new NotFoundException("variant not found");
            }

            //check if attribute exist
            const attribute = await this.attributeValuesService.findOneById(
                attrId,
                transaction
            );


            if (!attribute) throw new NotFoundException("attribute not found");

            //check if attribute already assign to that variant
            const productAttribute = await this.findOne(
                {
                    attrId,
                    productVariationId
                }
                ,
                transaction
            )

            if (productAttribute) throw new BadRequestException("product shouldn't has duplicate attributes")


            //create new record
            const productVariant = await this.productAttributeModel.create<ProductVariationAttribute>(
                {
                    productVariationId,
                    attrId
                },
                {
                    transaction
                }
            )

            if (!t) await transaction.commit()

            return t ? productVariant : productVariant["dataValues"];

        } catch (error) {

            if (!t) await transaction.rollback()

            if (error instanceof BadRequestException || error instanceof NotFoundException) throw error
            if (error.parent)
                throw new InternalServerErrorException(error.parent);
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const isDeleted = await this.productAttributeModel.destroy({ where: { id } });

            if (!isDeleted) throw new NotFoundException();

            return
        } catch (error) {
            throw error
        }
    }

}
