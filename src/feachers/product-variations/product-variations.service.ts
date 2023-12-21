import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ProductVariations } from './product-variations.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsService } from '../products/products.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class ProductVariationsService {

    constructor(
        @InjectModel(ProductVariations)
        private readonly productVariationModel: typeof ProductVariations,
        @Inject(forwardRef(() => ProductsService))
        private productsService: ProductsService,
        private sequelize: Sequelize,

    ) { }

    async _create(createProductVariationDto: CreateProductVariationDto, t: Transaction): Promise<ProductVariations> {
        try {

            const variant = await this.productVariationModel.create<ProductVariations>(
                createProductVariationDto,
                { transaction: t }
            )

            return variant
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('SKU should be unique');
            }
            throw error
        }
    }

    async create(createProductVariationDto: CreateProductVariationDto): Promise<ProductVariations> {
        try {

            const product = await this.productsService.findOneById(createProductVariationDto.productId);

            if (!product) throw new NotFoundException("product not found");

            const productVariant = await this.productVariationModel.create<ProductVariations>(createProductVariationDto)



            return productVariant["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('SKU should be unique');
            }
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
}
