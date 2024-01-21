import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { User } from 'src/core/decorators/user.decorator';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-add.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhoneQueryDto } from './dto/phone-query.dto';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { Permissions } from "./../../core/decorators/permissions.decorator"
import { PhoneDto } from './dto/phone.dto';
import { UserRole } from 'src/core/constants';
import { OwnerShipGuard } from 'src/core/guards/owner-ship.guard';
import { InjectUserInterceptor } from 'src/core/interceptors/inject-user.interceptor';

@ApiTags("Phones")
@ApiBearerAuth()
@Controller('phones')
@Permissions(PhonesService)
export class PhonesController {

    constructor(private readonly phonesService: PhonesService) { }

    @Get()
    @ApiOperation({ summary: "Find all user phones" })
    @ApiFindAllResponse(PhoneDto)
    async findAll(
        @Query() phoneQueryDto: PhoneQueryDto,
        @User("id") userId: number
    ) {
        try {

            phoneQueryDto.userId = userId;

            return await this.phonesService.findAll(phoneQueryDto);

        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @UseGuards(OwnerShipGuard)
    @ApiOperation({
        summary: "Find phone by ID",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: access to any record
        ${UserRole.CUSTOMER}: access to own record only
        `
    })
    @ApiParam({ name: "id", description: "Phone id" })
    @ApiOkResponse({ type: PhoneDto })
    async getOne(
        @Param("id", ParseIntPipe) id: number,
        @User("id") userId: number
    ) {
        try {

            const phone = await this.phonesService.findOne({
                id,
                userId
            });

            if (!phone) throw new NotFoundException()

            return phone
        } catch (error) {
            throw error
        }
    }

    @Post()
    @UseInterceptors(InjectUserInterceptor)
    @ApiOperation({
        summary: "Create a new phone",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: create phone for any user
        ${UserRole.CUSTOMER}: create own phone
        `
    })
    @ApiCreatedResponse({ type: PhoneDto })
    async create(@Body() createPhoneDto: CreatePhoneDto, @User("id") userId: number) {
        try {

            if (!createPhoneDto.userId)
                createPhoneDto.userId = userId;
            const phone = await this.phonesService.create(createPhoneDto);

            return phone
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @UseInterceptors(InjectUserInterceptor)
    @UseGuards(OwnerShipGuard)
    @ApiOperation({
        summary: "Update phone",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: update any phone
        ${UserRole.CUSTOMER}: update own phone only
        `
    })
    @ApiParam({ name: "id", description: "Phone id" })
    @ApiOkResponse({ type: PhoneDto })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updatePhoneDto: UpdatePhoneDto,
        @User("id") userId: number
    ) {
        try {

            if (!updatePhoneDto.userId)
                updatePhoneDto.userId = userId;

            const phone = await this.phonesService.update(id, updatePhoneDto);

            return { phone }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @UseGuards(OwnerShipGuard)
    @ApiOperation({
        summary: "Delete phone",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: delete any phone
        ${UserRole.CUSTOMER}: delete own phone only
        `
    }) @ApiParam({
        name: "id",
        description: "Phone id",
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param("id", ParseIntPipe) id: number,
        @User("id") userId: number
    ) {
        try {
            await this.phonesService.delete(id, userId);
            return
        } catch (error) {
            throw error
        }
    }
}
