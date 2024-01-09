import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { CreateProductVariationDto } from './dto/request/create-product-variations.dto';
import { ProductVariationsService } from './products-variations.service';
import { UpdateProductVariationDto } from './dto/request/update-product-variations.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { VariationScope } from './products-variations.entity';
import { VariationDto } from './dto/response/variation.dto';

@ApiTags("Product Variations")
@Controller('products-variations')
export class ProductVariationsController {

    constructor(private productVariationsService: ProductVariationsService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({ summary: "create new product variation" })
    @ApiCreatedResponse({ type: VariationDto })
    async create(
        @Body() createProductVariationDto: CreateProductVariationDto
    ) {
        try {

            const productVariation = await this.productVariationsService.create(createProductVariationDto)


            return productVariation
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({ summary: "update product variation" })
    @ApiParam({ name: "id", description: "variation id" })
    @ApiOkResponse({ type: VariationDto })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateProductVariationDto: UpdateProductVariationDto
    ) {
        try {

            const productVariation = await this.productVariationsService.update(id, updateProductVariationDto)


            return productVariation
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    @ApiOperation({ summary: "Find product variation by id" })
    @ApiParam({ name: "id", description: "variation id" })
    @ApiOkResponse({ type: VariationDto })
    async get(
        @Param("id", ParseIntPipe) id: number,
    ) {
        try {

            const productVariation = await this.productVariationsService.findOneById(id, Object.values(VariationScope))


            return productVariation
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({ summary: "delete product variation" })
    @ApiParam({ name: "id", description: "variation id" })
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


