import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { ProductsSubCategoriesService } from './products-sub-categories.service';
import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductSubCategoryDto } from './dto/productSubCategory.dto';

@ApiTags("Product Sub Category")
@ApiBearerAuth()
@Controller('products-sub-categories')
export class ProductsSubCategoriesController {
    constructor(private readonly productsSubCategoriesService: ProductsSubCategoriesService) { }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "assign subcategory to product",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({ type: ProductSubCategoryDto })
    async create(@Body() createProductSubCategoryDto: CreateProductSubCategoryDto) {
        try {

            const productSubCategory = await
                this.productsSubCategoriesService
                    .create(createProductSubCategoryDto)

            return productSubCategory
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "unassign subcategory to product",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiParam({ name: "id", description: "assign id" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.productsSubCategoriesService.delete(id);

            return;
        } catch (error) {
            throw error
        }
    }
}
