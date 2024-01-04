import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { User } from 'src/core/decorators/user.decorator';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-add.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhoneQueryDto } from './dto/phone-query.dto';
import { FindAlLPhoneSchema, PhoneSchema } from 'src/utility/swagger/schema/phone.schema';

@ApiTags("Phones")
@Controller('phones')
@ApiBearerAuth()
export class PhonesController {

    constructor(private readonly phonesService: PhonesService) { }

    @Get()
    @ApiOperation({ summary: "get all user phones" })
    @ApiOkResponse({
        type: FindAlLPhoneSchema
    })
    async get(
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
    @ApiOperation({ summary: "get specific user phone" })
    @ApiParam({
        name: "id",
        description: "Phone id",
    })
    @ApiOkResponse({
        type: PhoneSchema
    })
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
    @ApiOkResponse({
        type: PhoneSchema
    })
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
    @ApiParam({
        name: "id",
        description: "Phone id",
    })
    @ApiOkResponse({
        type: PhoneSchema
    })
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
