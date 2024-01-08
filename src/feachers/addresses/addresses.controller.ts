import { AddressesService } from './addresses.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateAddressDto } from './dto/request/create-address.dto';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateAddressDto } from './dto/request/update-address.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressQueryDto } from './dto/request/address-query.dto';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { AddressScope } from './address.entity';
import { CreateAddressResponseDto } from './dto/response/createAddress.dto';
import { FindAddressesResponseDto } from './dto/response/findAddresses.dto';
import { FindAddressResponseDto } from './dto/response/findAddress.dto';
import { UpdateAddressResponseDto } from './dto/response/updateAddress.dto';



@ApiTags("Addresses")
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) { }

    @Get()
    @ApiOperation({ summary: "Find all user addresses" })
    @ApiFindAllResponse(FindAddressesResponseDto)
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
    @ApiOperation({ summary: "Find user address by ID" })
    @ApiParam({ name: "id", description: "Address id" })
    @ApiOkResponse({ type: FindAddressResponseDto })
    async getOne(
        @Param("id", ParseIntPipe) id: number,
        @User("id") userId: number
    ) {
        try {

            const address = await this.addressesService.findOne({
                id,
                userId
            }, [AddressScope.WITH_USER]);

            if (!address) throw new NotFoundException()

            return address
        } catch (error) {
            throw error
        }
    }

    @Post()
    @ApiOperation({ summary: "Create a new address" })
    @ApiCreatedResponse({ type: CreateAddressResponseDto })
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
    @ApiParam({ description: "address id", name: 'id' })
    @ApiOkResponse({ type: UpdateAddressResponseDto })
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
    @ApiParam({ description: "address id", name: 'id' })
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
