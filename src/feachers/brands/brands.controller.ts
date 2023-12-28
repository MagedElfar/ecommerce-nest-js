import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brands.dto';
import { BrandQueryDto } from './dto/brands-query.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {

    constructor(private brandsService: BrandsService) { }

    @Get()
    async findAll(@Query() brandQueryDto: BrandQueryDto) {
        try {
            const categories = await this.brandsService.findAll(brandQueryDto);
            const count = await this.brandsService.getCount(brandQueryDto)
            return { count, categories }
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createBrandDto: CreateBrandDto) {
        try {
            const brand = await this.brandsService.create(createBrandDto);

            return { brand }
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto) {
        try {
            const brand = await this.brandsService.update(id, updateBrandDto);

            return { brand }
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const brand = await this.brandsService.findOne({ id });

            if (!brand) throw new NotFoundException()

            return { brand }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.brandsService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}


