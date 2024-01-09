import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesBrandsService } from './categories-brands.service';
import { CategoryBrandDto } from './dto/response/categoryBrand.dto';
import { CreateCategoryBrandDto } from './dto/request/create-category_attributes.dto';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';

@ApiTags("Category Brand")
@ApiBearerAuth()
@Controller('categories-brands')
export class CategoriesBrandsController {
    constructor(private readonly categoriesBrandsService: CategoriesBrandsService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "assign brand to category" })
    @ApiCreatedResponse({ type: CategoryBrandDto })
    async create(@Body() createCategoryBrandDto: CreateCategoryBrandDto) {
        try {

            const categoryBrand = await this.categoriesBrandsService.create(createCategoryBrandDto)

            return categoryBrand
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "unassign brand from the category" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.categoriesBrandsService.delete(id)

            return;
        } catch (error) {
            throw error
        }
    }
}
