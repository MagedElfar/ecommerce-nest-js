import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { User } from 'src/core/decorators/user.decorator';
import { CreatePhoneDto } from './dto/request/create-phone.dto';
import { UpdatePhoneDto } from './dto/request/update-add.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhoneQueryDto } from './dto/request/phone-query.dto';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { FindAllPhonesResponseDto } from './dto/response/findAllPhones.dto';
import { FindPhoneDto } from './dto/response/findPhone.dto';
import { CreatePhoneResponseDto } from './dto/response/creatPhone.dto';
import { UpdatePhoneResponseDto } from './dto/response/updatePhone.dto';

@ApiTags("Phones")
@ApiBearerAuth()
@Controller('phones')
export class PhonesController {

    constructor(private readonly phonesService: PhonesService) { }

    @Get()
    @ApiOperation({ summary: "Find all user phones" })
    @ApiFindAllResponse(FindAllPhonesResponseDto)
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
    @ApiOperation({ summary: "Find phone by ID" })
    @ApiParam({ name: "id", description: "Phone id" })
    @ApiOkResponse({ type: FindPhoneDto })
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
    @ApiOperation({ summary: "create phone" })
    @ApiCreatedResponse({ type: CreatePhoneResponseDto })
    async create(@Body() createPhoneDto: CreatePhoneDto, @User("id") userId: number) {
        try {

            createPhoneDto.userId = userId;

            const phone = await this.phonesService.create(createPhoneDto);

            return phone
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @ApiOperation({ summary: "update phone" })
    @ApiParam({ name: "id", description: "Phone id" })
    @ApiOkResponse({ type: UpdatePhoneResponseDto })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updatePhoneDto: UpdatePhoneDto,
        @User("id") userId: number
    ) {
        try {

            updatePhoneDto.userId = userId;

            const phone = await this.phonesService.update(id, updatePhoneDto);

            return { phone }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete phone" })
    @ApiParam({
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
