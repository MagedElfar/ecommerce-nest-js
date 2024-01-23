import { UserRole } from 'src/core/constants';
import { ProductsService } from '../services/products.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { User } from 'src/core/decorators/user.decorator';
import { Roles } from 'src/core/decorators/role.decorator';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFindAllResponse } from 'src/core/decorators/api-find-all-response.decorator';
import { FindProducts } from '../dto/findProducts.dto';
import { ProductDto } from '../dto/product.dto';

@ApiTags("Products")
@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find many products" })
    @ApiFindAllResponse(FindProducts)
    async findAll(@Query() productQueryDto: ProductQueryDto) {
        try {
            const products = await this.productsService.findAll(productQueryDto);
            return products
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "create a new product",
        description: `Role Required: ${UserRole.ADMIN}`
    })
    @ApiCreatedResponse({ type: ProductDto })
    async create(@Body() createProductDto: CreateProductDto, @User("id") userId: number) {
        try {
            createProductDto.userId = userId

            const product = await this.productsService.create(createProductDto)

            return product
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    @ApiOperation({
        summary: "Find product by id",
        description: `Role Required: ${UserRole.ADMIN}`
    })
    @ApiParam({ name: "id", description: "product id" })
    @ApiOkResponse({ type: ProductDto })
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {

            const product = await this.productsService.fullData(id)


            return product
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "update product",
        description: `Role Required: ${UserRole.ADMIN}`
    })
    @ApiParam({ name: "id", description: "product id" })
    @ApiOkResponse({ type: ProductDto })
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        try {

            const product = await this.productsService.updated(id, updateProductDto)

            return product
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Find product by id",
        description: `Role Required: ${UserRole.ADMIN}`
    })
    @ApiParam({ name: "id", description: "product id" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.productsService.delete(id);

            return;

        } catch (error) {
            throw error
        }
    }
}
