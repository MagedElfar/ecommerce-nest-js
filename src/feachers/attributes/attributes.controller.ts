import { Roles } from 'src/core/decorators/role.decorator';
import { AttributesService } from './attributes.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, OmitType } from '@nestjs/swagger';
import { AttributeScopes } from './entities/attribute.entity';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { AttributeDto } from './dto/attribute.dto';


@ApiTags("Attribute")
@Controller('attributes')
export class AttributesController {

    constructor(private readonly attributesService: AttributesService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find all attributes" })
    @ApiFindAllResponse(AttributeDto)
    async findAll() {
        try {
            const attributes = await this.attributesService.findAll([AttributeScopes.VALUE_WITH_TOTAL]);
            return attributes
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    @ApiOperation({ summary: "Find attribute by id " })
    @ApiParam({ name: "id", description: "attribute id" })
    @ApiOkResponse({ type: AttributeDto })
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const attributes = await this.attributesService.findOneById(id, [AttributeScopes.VALUE]);

            if (!attributes) throw new NotFoundException("Attribute not found")

            return attributes
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "create new attribute",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({ type: AttributeDto })
    async create(@Body() createAttributeDto: CreateAttributeDto) {
        try {
            const attribute = await this.attributesService.create(createAttributeDto)

            return attribute
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiBearerAuth()
    @ApiParam({ name: "id", description: "attribute id" })
    @ApiOperation({
        summary: "update attribute", description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiOkResponse({ type: AttributeDto })
    async update(@Body() updateAttributeDto: UpdateAttributeDto, @Param("id", ParseIntPipe) id: number) {
        try {
            const attribute = await this.attributesService.update(id, updateAttributeDto)

            return attribute
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiBearerAuth()
    @ApiParam({ name: "id", description: "attribute id" })
    @ApiOperation({
        summary: "delete attribute",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.attributesService.delete(id);

            return

        } catch (error) {
            throw error
        }
    }
}
