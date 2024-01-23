import { Roles } from 'src/core/decorators/role.decorator';
import { AttributeValuesService } from './attributes-values.service';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { AttributeValueDto } from './dto/attribute-value.dto';

@ApiTags("Attribute Value")
@ApiBearerAuth()
@Controller('attributes-values')
export class AttributeValuesController {

    constructor(private attributeValuesService: AttributeValuesService) { }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "create new attribute value",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({ type: AttributeValueDto })
    async create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
        try {

            return await this.attributeValuesService.create(createAttributeValueDto);

        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiOperation({
        summary: "update attribute value",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiParam({ name: "id", description: "attribute value id" })
    @ApiOkResponse({ type: AttributeValueDto })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAttributeValueDto: UpdateAttributeValueDto
    ) {
        try {

            return await this.attributeValuesService.update(id, updateAttributeValueDto);

        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @ApiOperation({
        summary: "delete attribute value",
        description: `Role Required:  ${UserRole.ADMIN}`
    })
    @ApiParam({ name: "id", description: "attribute value id" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            const value = await this.attributeValuesService.delete(id);

            return { message: "Attribute value is deleted successfully" }
        } catch (error) {
            throw error
        }
    }
}
