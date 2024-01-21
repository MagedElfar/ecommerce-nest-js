import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesBrandsService } from './categories-brands.service';
import { CategoryBrandDto } from './dto/categoryBrand.dto';
import { CreateCategoryBrandDto } from './dto/create-category_brand.dto';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';

@ApiTags("Category Brand")
@ApiBearerAuth()
@Controller('categories-brands')
export class CategoriesBrandsController {
    constructor(private readonly categoriesBrandsService: CategoriesBrandsService) { }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "assign brand to category",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
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
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "unassign brand from the category",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.categoriesBrandsService.delete(id)

            return;
        } catch (error) {
            throw error
        }
    }
}
