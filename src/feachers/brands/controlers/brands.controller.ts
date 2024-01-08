import { BrandScope } from './../brands.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from 'src/core/constants';
import { BrandsService } from '../services/brands.service';
import { CreateBrandDto } from '../dto/request/create-brands.dto';
import { BrandQueryDto } from '../dto/request/brands-query.dto';
import { UpdateBrandDto } from '../dto/request/update-brand.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { FindAllBrandsResponseDto } from '../dto/response/findBrands.dto';
import { CreateBrandResponseDto } from '../dto/response/create.dto';
import { UpdateBrandResponseDto } from '../dto/response/update.dto';
import { FindOneBrandResponseDto } from '../dto/response/findBrand.dto';

@ApiTags("Brands")
@Controller('brands')
@ApiBearerAuth()
export class BrandsController {

    constructor(private brandsService: BrandsService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: "Find All brands" })
    @ApiFindAllResponse(FindAllBrandsResponseDto)
    async findAll(@Query() brandQueryDto: BrandQueryDto) {
        try {
            const brands = await this.brandsService.findAll(brandQueryDto, [BrandScope.WITH_IMAGE]);
            return brands
        } catch (error) {
            throw error
        }
    }

    @Post()
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "create new brand" })
    @ApiCreatedResponse({
        type: CreateBrandResponseDto
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
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: "update brand" })
    @ApiParam({ name: "id", description: "brandId" })
    @ApiOkResponse({
        type: UpdateBrandResponseDto
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
        type: FindOneBrandResponseDto
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
    @Roles([UserRole.ADMIN])
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "delete brand" })
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


