import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { CategoriesAttributeService } from './categories-attributes.service';
import { CreateCategoryAttributesDto } from './dto/create-category_attributes.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryAttributeDto } from './dto/categoryAttribute.dto';

@ApiTags("Category Attribute")
@ApiBearerAuth()
@Controller('categories-attributes')
export class CategoriesAttributesController {

    constructor(private readonly categoriesAttributeService: CategoriesAttributeService) { }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "assign attribute to category",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({ type: CategoryAttributeDto })
    async create(@Body() createCategoryAttributesDto: CreateCategoryAttributesDto) {
        try {

            const categoryAttribute = await this.categoriesAttributeService.create(createCategoryAttributesDto)

            return categoryAttribute
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "unassign attribute from the category",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`

    })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.categoriesAttributeService.delete(id)

            return;
        } catch (error) {
            throw error
        }
    }
}
