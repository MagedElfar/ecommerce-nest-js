import { CategoriesService } from '../services/categories.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryQueryDto } from '../dto/category-query.dto';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) { }

    @Get()
    @Public()
    async findAll(@Query() categoryQueryDto: CategoryQueryDto) {
        try {
            const categories = await this.categoriesService.findAll(categoryQueryDto);
            const count = await this.categoriesService.getCount(categoryQueryDto)
            return { count, categories }
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        try {
            const category = await this.categoriesService.create(createCategoryDto);

            return { category }
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        try {
            const category = await this.categoriesService.update(id, updateCategoryDto);

            return { category }
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const category = await this.categoriesService.findOne({ id });

            if (!category) throw new NotFoundException()

            return { category }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.categoriesService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}


