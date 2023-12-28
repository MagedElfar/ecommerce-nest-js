import { Roles } from 'src/core/decorators/role.decorator';
import { AttributeValuesService } from './attributes-values.service';
import { Body, Controller, Post } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';

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
}
