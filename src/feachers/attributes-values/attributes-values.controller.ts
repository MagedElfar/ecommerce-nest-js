import { Roles } from 'src/core/decorators/role.decorator';
import { AttributeValuesService } from './attributes-values.service';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAttributeValueResponseDto } from './dto/response/createAttribueValue.dto';
import { UpdateAttributeValueResponseDto } from './dto/response/updateAttribueValue.dto';

@ApiTags("Attributes Values")
@Controller('attributes-values')
export class AttributeValuesController {

    constructor(private attributeValuesService: AttributeValuesService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "create new attribute value" })
    @ApiCreatedResponse({ type: CreateAttributeValueResponseDto })
    async create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
        try {

            const value = await this.attributeValuesService.create(createAttributeValueDto);

            return value
        } catch (error) {
            throw error
        }
    }

    @Put()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "update attribute value" })
    @ApiParam({ name: "id", description: "attribute value id" })
    @ApiOkResponse({ type: UpdateAttributeValueResponseDto })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAttributeValueDto: UpdateAttributeValueDto
    ) {
        try {
            const value = await this.attributeValuesService.update(id, updateAttributeValueDto);

            return value
        } catch (error) {
            throw error
        }
    }

    @Delete()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "delete attribute value" })
    @ApiParam({ name: "id", description: "attribute value id" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            const value = await this.attributeValuesService.delete(id);

            return value
        } catch (error) {
            throw error
        }
    }
}
