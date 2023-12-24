import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductVariationAttribute } from './product_variation_attributes.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariationsService } from '../product-variations/product-variations.service';
import { IProductVariationAttributes } from './product_variation_attributes.interface';
import { CreateProductAttributesDto } from './dto/create-product_variation_attributes.dto';
import { AttributeValuesService } from '../attribute-values/attribute-values.service';
import { Transaction } from 'sequelize';


@Injectable()
export class ProductVariationAttributesService {
    constructor(
        @InjectModel(ProductVariationAttribute)
        private readonly productAttributeModel: typeof ProductVariationAttribute,
        @Inject(forwardRef(() => ProductVariationsService))
        private readonly productVariationsService: ProductVariationsService,
        private readonly attributeValuesService: AttributeValuesService
    ) { }

    async findOne(
        data: Partial<Omit<IProductVariationAttributes, "proVar" | "attribute">>,
        t?: Transaction

    ): Promise<IProductVariationAttributes | null> {
        try {

            const productAttribute = await this.productAttributeModel.findOne({
                where: data,
                transaction: t
            });

            if (!productAttribute) return null

            return productAttribute["dataValues"]
        } catch (error) {

            throw error
        }
    }


    async create(
        createProductAttributesDto: CreateProductAttributesDto,
        t?: Transaction
    ): Promise<IProductVariationAttributes> {
        try {

            const { attrId, productVariationId } = createProductAttributesDto;

            if (!t) {
                const variant = await this.productVariationsService.findOneById(productVariationId);

                if (!variant) throw new NotFoundException("variant not found");
            }

            const attribute = await this.attributeValuesService.findOneById(attrId, t);

            if (!attribute) throw new NotFoundException("attribute not found");

            const productAttribute = await this.findOne({
                attrId,
                productVariationId
            }, t)


            if (productAttribute) throw new BadRequestException("value already assign to this attribute")

            const productVariant = await this.productAttributeModel.create<ProductVariationAttribute>(
                {
                    productVariationId,
                    attrId
                },
                {
                    transaction: t
                }
            )

            return productVariant["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException("value already assign to this attribute")
            }
            throw error
        }
    }
}
