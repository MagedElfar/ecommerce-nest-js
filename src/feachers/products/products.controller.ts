import { UserRole } from 'src/core/constants';
import { ProductsService } from './products.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from 'src/core/decorators/user.decorator';
import { Roles } from 'src/core/decorators/role.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }


    @Get()
    @Public()
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
    async create(@Body() createProductDto: CreateProductDto, @User("id") userId: number) {
        try {
            createProductDto.userId = userId

            const product = await this.productsService.create(createProductDto)

            return { product }
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {

            const product = await this.productsService.findOneFullData({ id })


            return { product }
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        try {

            const product = await this.productsService.updated(id, updateProductDto)

            return { product }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.productsService.delete(id);

            return;

        } catch (error) {
            throw error
        }
    }
}
