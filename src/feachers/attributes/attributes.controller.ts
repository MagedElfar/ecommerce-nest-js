import { Roles } from 'src/core/decorators/role.decorator';
import { AttributesService } from './attributes.service';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UserRole } from 'src/core/constants';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AttributeScopes } from './entities/attribute.entity';
import { ApiFindAllResponse } from 'src/core/decorators/api-find-all-response.decorator';
import { AttributeDto } from './dto/attribute.dto';
import { AttributeQueryDto } from './dto/attribute.query';


@ApiTags("Attribute")
@Controller('attributes')
export class AttributesController {

    constructor(private readonly attributesService: AttributesService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find all attributes" })
    @ApiFindAllResponse(AttributeDto)
    async findAll(@Query() attributeQueryDto: AttributeQueryDto) {
        try {
            return await this.attributesService.findAll(
                attributeQueryDto,
                [AttributeScopes.VALUE_WITH_TOTAL]
            );
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
            const attribute = await this.attributesService.findById(id, [AttributeScopes.VALUE]);

            if (!attribute) throw new NotFoundException("Attribute Not found");

            return attribute

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
            return await this.attributesService.create(createAttributeDto)
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

            return await this.attributesService.update(id, updateAttributeDto)

        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN])
    @ApiBearerAuth()
    @ApiParam({ name: "id", description: "attribute id" })
    @ApiOperation({
        summary: "delete attribute",
        description: `Role Required:  ${UserRole.ADMIN}`
    })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {

            await this.attributesService.delete(id);

            return { message: "Attribute is deleted successfully" }

        } catch (error) {
            throw error
        }
    }
}
