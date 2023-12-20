import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { IProduct } from './product.interface';
import * as slugify from "slugify"

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product
    ) { }

    async create(createProductDto: CreateProductDto): Promise<IProduct> {
        try {
            const slug: string = slugify.default(createProductDto.name, {
                lower: true,
                trim: true
            })

            const product = await this.productModel.create<Product>({
                ...createProductDto,
                slug
            })

            return product["dataValues"]
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Product is already exist');
            }
            throw error
        }
    }
}
