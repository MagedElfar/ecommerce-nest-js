import { SubCategoriesService } from '../services/sub-categories.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateSubCategoryDto } from '../dto/request/create-sub-category.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { UpdateSubCategoryDto } from '../dto/request/update-sub-category.dto';
import { SubCategoryQueryDto } from '../dto/request/sub-categoryQuery.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { FindSubCategoriesDto } from '../dto/response/findSubCtegories.dto';
import { CreateSubCategoryResponseDto } from '../dto/response/createCategory.dto';
import { UpdateSubCategoryResponseDto } from '../dto/response/updateCategory.dto';
import { SubCategoryScope } from '../enities/sub-categories.entity';

@ApiTags("Sub categories")
@ApiBearerAuth()
@Controller('sub-categories')
export class SubCategoriesController {

    constructor(private subCategoriesService: SubCategoriesService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find All sub categories" })
    @ApiFindAllResponse(FindSubCategoriesDto)
    async findAll(@Query() categoryQueryDto: SubCategoryQueryDto) {
        try {
            const subCategories = await this.subCategoriesService.findAll(categoryQueryDto);
            return subCategories
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "create new sub category",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({ type: CreateSubCategoryResponseDto })
    async create(@Body() createCategoryDto: CreateSubCategoryDto) {
        try {
            const subCategory = await this.subCategoriesService.create(createCategoryDto);

            return subCategory
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "update sub category",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiParam({ name: "id", description: "sub category id" })
    @ApiOkResponse({ type: UpdateSubCategoryResponseDto })
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateSubCategoryDto) {
        try {
            const subCategory = await this.subCategoriesService.update(id, updateCategoryDto);

            return subCategory
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    @ApiOperation({
        summary: "Find sub category by id",
    })
    @ApiParam({ name: "id", description: "sub category id" })
    @ApiOkResponse({ type: FindSubCategoriesDto })
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const subCategory = await this.subCategoriesService.findOne({ id }, [SubCategoryScope.WITH_IMAGE]);

            if (!subCategory) throw new NotFoundException()

            return subCategory
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: "delete sub category",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiParam({ name: "id", description: "sub category id" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.subCategoriesService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}


