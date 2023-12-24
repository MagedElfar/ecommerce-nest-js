import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { IProduct } from './product.interface';
import * as slugify from "slugify"
import { ProductVariationsService } from '../product-variations/product-variations.service';
import { Sequelize } from 'sequelize-typescript';
import { CreateProductVariationDto } from '../product-variations/dto/create-product-variations.dto';
import { ProductVariations } from '../product-variations/product-variations.entity';
import { AttributeValues } from '../attribute-values/attribute-values.entity';
import { Attribute } from '../attributes/attribute.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
        @Inject(forwardRef(() => ProductVariationsService))
        private productVariationsService: ProductVariationsService,
        private sequelize: Sequelize,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<IProduct> {

        const t = await this.sequelize.transaction()

        try {
            const { variant, ...productDto } = createProductDto;

            const slug: string = slugify.default(createProductDto.name, {
                lower: true,
                trim: true
            })

            const product = await this.productModel.create<Product>(
                {
                    ...productDto,
                    slug,
                },
                { transaction: t }
            )

            const productVariant = await this.productVariationsService._create({
                ...variant,
                productId: product["dataValues"].id
            }, t)


            t.commit()
            return {
                ...product["dataValues"],
                variations: [productVariant]
            }
        } catch (error) {
            t.rollback()
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Product is already exist');
            }
            throw error
        }
    }

    async findOneFullData(data: Partial<Omit<Product, "variations">>): Promise<IProduct | null> {
        try {
            const product = await this.productModel.findOne({
                where: data,
                include: [
                    {
                        model: ProductVariations,
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
                        }]
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

            console.log(attributes)

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
