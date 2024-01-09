import { CategoriesService } from '../services/categories.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { CategoryQueryDto } from '../dto/request/category-query.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, OmitType } from '@nestjs/swagger';
import { CategoryScope } from '../categories.entity';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { FindCategoriesDto } from '../dto/response/findCategories.dto';
import { CreateCategoryResponse } from '../dto/response/create.dto';
import { CategoryDto } from '../dto/response/category.dto';

@ApiTags("Category")
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find all categories", security: [] })
    @ApiFindAllResponse(FindCategoriesDto)
    async findAll(@Query() categoryQueryDto: CategoryQueryDto) {
        try {
            const categories = await this.categoriesService.findAll(categoryQueryDto, [
                CategoryScope.WITH_IMAGE,
                CategoryScope.WITH_EMPTY_PRODUCT
            ]);
            return categories
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiOperation({ summary: "create new category" })
    @ApiCreatedResponse({ type: CreateCategoryResponse })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        try {
            const category = await this.categoriesService.create(createCategoryDto);

            return category
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "update category" })
    @ApiBearerAuth()
    @ApiParam({
        name: "id",
        description: "category id"
    })
    @ApiOkResponse({ type: CategoryDto })
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        try {
            const category = await this.categoriesService.update(id, updateCategoryDto);


            return category
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    @ApiOperation({ summary: "Find category by Id", security: [] })
    @ApiParam({
        name: "id",
        description: "category id"
    })
    @ApiOkResponse({ type: CategoryDto })
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const category = await this.categoriesService.findOneById(id, [
                CategoryScope.WITH_EMPTY_PRODUCT,
                CategoryScope.WITH_SUB_CATEGORY,
                CategoryScope.WITH_IMAGE,
                CategoryScope.WITH_BRAND,
                CategoryScope.WITH_ATTRIBUTES
            ]);

            if (!category) throw new NotFoundException()

            const attributes = this.categoriesService.mappedCategoryAttributes(category)

            return {
                ...category,
                attributes
            }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "delete category" })
    @ApiBearerAuth()
    @ApiParam({
        name: "id",
        description: "category id"
    })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.categoriesService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}


