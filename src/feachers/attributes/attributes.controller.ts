import { Roles } from 'src/core/decorators/role.decorator';
import { AttributesService } from './attributes.service';
import { Body, Controller, Post } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { CreateAttributeDto } from './dto/create-attribute.dto';

@Controller('attributes')
export class AttributesController {

    constructor(private readonly attributesService: AttributesService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createAttributeDto: CreateAttributeDto) {
        try {
            const attribute = await this.attributesService.create(createAttributeDto)

            return { attribute }
        } catch (error) {
            throw error
        }
    }
}
