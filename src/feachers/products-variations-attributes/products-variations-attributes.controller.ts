import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductVariationAttributesService } from './products-variations-attributes.service';
import { UserRole } from 'src/core/constants';
import { Roles } from 'src/core/decorators/role.decorator';
import { CreateProductAttributesDto } from './dto/request/create-product_variation_attributes.dto';
import { ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductAttributeDto } from './dto/response/productAttribute.dto';

@ApiTags("Products Attributes")
@Controller('products-attributes')
export class ProductVariationAttributesController {

    constructor(private readonly productVariationAttributesService: ProductVariationAttributesService) { }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "assign attribute value to product variation",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({ type: ProductAttributeDto })
    async create(@Body() createProductAttributesDto: CreateProductAttributesDto) {
        try {

            const productAttribute = await this.productVariationAttributesService.create(createProductAttributesDto)

            return productAttribute
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "unassign attribute value from product variation",
        description: `Required Roles: ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiParam({ name: "id", description: "assign id" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.productVariationAttributesService.delete(id)

            return;
        } catch (error) {
            throw error
        }
    }
}
