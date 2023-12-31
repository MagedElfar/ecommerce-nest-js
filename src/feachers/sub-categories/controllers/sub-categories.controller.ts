import { SubCategoriesService } from '../services/sub-categories.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateSubCategoryDto } from '../dto/create-sub-category.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { UpdateSubCategoryDto } from '../dto/update-sub-category.dto';
import { SubCategoryQueryDto } from '../dto/sub-categoryQuery.dto';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('sub-categories')
export class SubCategoriesController {

    constructor(private subCategoriesService: SubCategoriesService) { }

    @Get()
    @Public()
    async findAll(@Query() categoryQueryDto: SubCategoryQueryDto) {
        try {
            const subCategories = await this.subCategoriesService.findAll(categoryQueryDto);
            return subCategories
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createCategoryDto: CreateSubCategoryDto) {
        try {
            const subCategory = await this.subCategoriesService.create(createCategoryDto);

            return { subCategory }
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateSubCategoryDto) {
        try {
            const subCategory = await this.subCategoriesService.update(id, updateCategoryDto);

            return { subCategory }
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const subCategory = await this.subCategoriesService.findOne({ id });

            if (!subCategory) throw new NotFoundException()

            return { subCategory }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.subCategoriesService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}

