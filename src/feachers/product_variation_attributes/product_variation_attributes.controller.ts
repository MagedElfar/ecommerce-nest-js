import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductVariationAttributesService } from './product_variation_attributes.service';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { CreateProductAttributesDto } from './dto/create-product_variation_attributes.dto';

@Controller('product-attributes')
export class ProductVariationAttributesController {

    constructor(private readonly productVariationAttributesService: ProductVariationAttributesService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createProductAttributesDto: CreateProductAttributesDto) {
        try {

            const productAttribute = await this.productVariationAttributesService.create(createProductAttributesDto)

            return { productAttribute }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles([UserRole.ADMIN])
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.productVariationAttributesService.delete(id)

            return;
        } catch (error) {
            throw error
        }
    }
}
