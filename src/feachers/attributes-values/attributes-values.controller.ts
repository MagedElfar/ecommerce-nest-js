import { Roles } from 'src/core/decorators/role.decorator';
import { AttributeValuesService } from './attributes-values.service';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';

@Controller('attributes-values')
export class AttributeValuesController {

    constructor(private attributeValuesService: AttributeValuesService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
        try {
            const value = await this.attributeValuesService.create(createAttributeValueDto);

            return { value }
        } catch (error) {
            throw error
        }
    }

    @Put()
    @Roles([UserRole.ADMIN])
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAttributeValueDto: UpdateAttributeValueDto
    ) {
        try {
            const value = await this.attributeValuesService.update(id, updateAttributeValueDto);

            return { value }
        } catch (error) {
            throw error
        }
    }

    @Delete()
    @Roles([UserRole.ADMIN])
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            const value = await this.attributeValuesService.delete(id);

            return { value }
        } catch (error) {
            throw error
        }
    }
}
