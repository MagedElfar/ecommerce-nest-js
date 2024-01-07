import { IAddress } from './address.interface';
import { AddressesService } from './addresses.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressQueryDto } from './dto/address-query.dto';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { AddressDto } from './dto/address.dto';


@ApiTags("Addresses")
@Controller('addresses')
@ApiBearerAuth()
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) { }

    @Get()
    @ApiFindAllResponse(AddressDto)
    @ApiOperation({ summary: "get all user addresses" })
    async get(
        @Query() addressQueryDto: AddressQueryDto,
        @User("id") userId: number
    ) {
        try {

            addressQueryDto.userId = userId;

            const addresses = await this.addressesService.findAll(addressQueryDto);

            return addresses
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @ApiOperation({ summary: "get specific user address" })
    @ApiParam({
        name: "id",
        description: "Address id",
    })
    @ApiOkResponse({
        type: AddressDto
    })
    async getOne(
        @Param("id", ParseIntPipe) id: number,
        @User("id") userId: number
    ) {
        try {

            const address = await this.addressesService.findOne({
                id,
                userId
            });

            if (!address) throw new NotFoundException()

            return address
        } catch (error) {
            throw error
        }
    }

    @Post()
    @ApiOperation({ summary: "create new address" })
    @ApiCreatedResponse({
        type: AddressDto
    })
    async create(@Body() createAddressDto: CreateAddressDto, @User("id") userId: number) {
        try {

            createAddressDto.userId = userId;

            const address = await this.addressesService.create(createAddressDto);

            return address
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @ApiOperation({ summary: "update address" })
    @ApiParam({
        description: "address id",
        name: 'id'
    })
    @ApiOkResponse({
        type: AddressDto
    })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAddressDto: UpdateAddressDto,
        @User("id") userId: number
    ) {
        try {

            updateAddressDto.userId = userId;

            const address = await this.addressesService.update(id, updateAddressDto);

            return address
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete address" })
    @ApiParam({
        description: "address id",
        name: 'id'
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param("id", ParseIntPipe) id: number,
        @User("id") userId: number
    ) {
        try {
            await this.addressesService.delete(id, userId);
            return
        } catch (error) {
            throw error
        }
    }
}
