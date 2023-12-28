import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { ProductVariationsService } from './products-variations.service';
import { UpdateProductVariationDto } from './dto/update-product-variations.dto';

@Controller('products-variations')
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

    @Put(":id")
    @Roles([UserRole.ADMIN])
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateProductVariationDto: UpdateProductVariationDto
    ) {
        try {

            const productVariation = await this.productVariationsService.update(id, updateProductVariationDto)


            return { productVariation }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    async delete(
        @Param("id", ParseIntPipe) id: number,
    ) {
        try {

            await this.productVariationsService.delete(id)

            return
        } catch (error) {
            throw error
        }
    }
}
