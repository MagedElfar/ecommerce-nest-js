import { CategoriesService } from '../services/categories.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryQueryDto } from '../dto/category-query.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, OmitType } from '@nestjs/swagger';
import { CategoryScope } from '../entities/categories.entity';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { CategoryDto } from '../dto/category.dto';

@ApiTags("Category")
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find all categories", security: [] })
    @ApiFindAllResponse(CategoryDto)
    async findAll(@Query() categoryQueryDto: CategoryQueryDto) {
        try {
            const categories = await this.categoriesService.findAll(categoryQueryDto, [
                CategoryScope.WITH_IMAGE,
                CategoryScope.WITH_EMPTY_PRODUCT,
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
    @ApiCreatedResponse({ type: CategoryDto })
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
            const category = await this.categoriesService.findOneById(id, Object.values(CategoryScope));

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

    @Get("slug/:slug")
    @Public()
    @ApiOperation({ summary: "Find category by slug", security: [] })
    @ApiParam({
        name: "slug",
        description: "category slug"
    })
    @ApiOkResponse({ type: CategoryDto })
    async findOneBySlug(@Param("slug") slug: string) {
        try {
            const category = await this.categoriesService.findOne({ slug }, Object.values(CategoryScope));

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


