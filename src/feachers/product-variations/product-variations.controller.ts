import { Body, Controller, Post } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { User } from '../users/user.entity';
import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { ProductVariationsService } from './product-variations.service';

@Controller('product-variations')
export class ProductVariationsController {

    constructor(private productVariationsService: ProductVariationsService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(
        @Body() createProductVariationDto: CreateProductVariationDto
    ) {
        try {

            const productVariation = await this.productVariationsService.create(createProductVariationDto)


            return { productVariation }
        } catch (error) {
            throw error
        }
    }
}
