import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { CreateProductVariationDto } from './dto/create-product-variations.dto';
import { ProductVariationsService } from './products-variations.service';
import { UpdateProductVariationDto } from './dto/update-product-variations.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { VariationScope } from './entities/products-variations.entity';
import { VariationDto } from './dto/variation.dto';
import { ApiFindAllResponse } from 'src/core/decorators/api-find-all-response.decorator';
import { VariationQueryDto } from './dto/product-variation-query.dto';

@ApiTags("Products Variations")
@Controller('products-variations')
export class ProductVariationsController {

    constructor(private productVariationsService: ProductVariationsService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find all variations" })
    @ApiFindAllResponse(VariationDto)
    async findAll(
        @Query() variationQueryDto: VariationQueryDto
    ) {
        try {

            const productVariation = await this.productVariationsService.findAll(variationQueryDto, [
                VariationScope.WITH_MEDIA,
                VariationScope.WITH_PRODUCT
            ])


            return productVariation
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "create new product variation",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
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
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "update product variation",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
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

            const productVariation = await this.productVariationsService.findOneById(id, [
                VariationScope.WITH_PRODUCT,
                VariationScope.WITH_MEDIA,
                VariationScope.WITH_ATTRIBUTES
            ])


            return productVariation
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "delete product variation",
        description: `Required Roles: ${UserRole.ADMIN}`
    })
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


