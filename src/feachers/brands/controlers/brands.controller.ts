import { BrandScope } from '../entities/brands.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { BrandsService } from '../services/brands.service';
import { CreateBrandDto } from '../dto/create-brands.dto';
import { BrandQueryDto } from '../dto/brands-query.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { BrandDto } from '../dto/brand.dto';

@ApiTags("Brands")
@Controller('brands')
export class BrandsController {

    constructor(private brandsService: BrandsService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find All brands" })
    @ApiFindAllResponse(BrandDto)
    async findAll(@Query() brandQueryDto: BrandQueryDto) {
        try {
            const brands = await this.brandsService.findAll(brandQueryDto, [BrandScope.WITH_IMAGE]);
            return brands
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "create new brand",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiCreatedResponse({
        type: BrandDto
    })
    async create(@Body() createBrandDto: CreateBrandDto) {
        try {
            const brand = await this.brandsService.create(createBrandDto);

            return brand
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @ApiBearerAuth()
    @ApiOperation({
        summary: "update brand",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiParam({ name: "id", description: "brandId" })
    @ApiOkResponse({
        type: BrandDto
    })
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto) {
        try {
            const brand = await this.brandsService.update(id, updateBrandDto);

            return brand
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @Public()
    @ApiOperation({ summary: "get brand" })
    @ApiParam({ name: "id", description: "brandId" })
    @ApiOkResponse({
        type: BrandDto
    })
    async findOne(@Param("id", ParseIntPipe) id: number) {
        try {
            const brand = await this.brandsService.findOne({ id }, [BrandScope.WITH_IMAGE]);

            if (!brand) throw new NotFoundException()

            return brand
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @Roles([UserRole.ADMIN, UserRole.MANAGER])
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "delete brand",
        description: `Role Required:  ${UserRole.ADMIN} - ${UserRole.MANAGER}`
    })
    @ApiParam({ name: "id", description: "brandId" })
    async delete(@Param("id", ParseIntPipe) id: number) {
        try {
            await this.brandsService.delete(id);
            return
        } catch (error) {
            throw error
        }
    }
}


