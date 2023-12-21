import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariationAttribute } from './product_variation_attributes.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariationsService } from '../product-variations/product-variations.service';
import { IProductVariationAttributes } from './product_variation_attributes.interface';
import { CreateProductAttributesDto } from './dto/create-product_variation_attributes.dto';
import { AttributeValuesService } from '../attribute-values/attribute-values.service';

@Injectable()
export class ProductVariationAttributesService {
    constructor(
        @InjectModel(ProductVariationAttribute)
        private readonly productAttributeModel: typeof ProductVariationAttribute,
        private readonly productVariationsService: ProductVariationsService,
        private readonly attributeValuesService: AttributeValuesService
    ) { }

    async findOne(data: Partial<Omit<IProductVariationAttributes, "proVar" | "attribute">>): Promise<IProductVariationAttributes | null> {
        try {

            const productAttribute = await this.productAttributeModel.findOne({ where: data });

            if (!productAttribute) return null

            return productAttribute["dataValues"]
        } catch (error) {

            throw error
        }
    }

    async create(createProductAttributesDto: CreateProductAttributesDto): Promise<IProductVariationAttributes> {
        try {

            const { attrId, productVariationId } = createProductAttributesDto;

            const variant = await this.productVariationsService.findOneById(productVariationId);

            if (!variant) throw new NotFoundException("variant not found");


            const attribute = await this.attributeValuesService.findOneById(attrId);

            if (!attribute) throw new NotFoundException("attribute not found");

            console.log("CreateProductAttributesDto = ", createProductAttributesDto)

            const productAttribute = await this.findOne({
                attrId,
                productVariationId
            })

            if (productAttribute) throw new BadRequestException("value already assign to this attribute")

            console.log("CreateProductAttributesDto")
            const productVariant = await this.productAttributeModel.create<ProductVariationAttribute>({
                productVariationId,
                attrId
            })



            return productVariant["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('SKU should be unique');
            }
            throw error
        }
    }
}
