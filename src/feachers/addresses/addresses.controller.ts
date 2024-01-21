import { Permissions } from './../../core/decorators/permissions.decorator';
import { AddressesService } from './addresses.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressQueryDto } from './dto/address-query.dto';
import { ApiFindAllResponse } from 'src/core/decorators/apiFindAllResponse';
import { Address, AddressScope } from './entities/address.entity';
import { OwnerShipGuard } from 'src/core/guards/owner-ship.guard';
import { InjectUserInterceptor } from 'src/core/interceptors/inject-user.interceptor';
import { AddressDto } from './dto/address.dto';
import { UserRole } from 'src/core/constants';


@ApiTags("Addresses")
@ApiBearerAuth()
@Controller('addresses')
@Permissions(AddressesService)
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) { }

    @Get()
    @ApiOperation({
        summary: "Find all user addresses",
        description: `Required Roles : not specific role required `
    })
    @ApiFindAllResponse(AddressDto)
    async get(
        @Query() addressQueryDto: AddressQueryDto,
        @User("id") userId: number
    ) {
        try {

            addressQueryDto.userId = userId;

            return await this.addressesService.findAll(addressQueryDto);
        } catch (error) {
            throw error
        }
    }

    @Get(":id")
    @UseGuards(OwnerShipGuard)
    @ApiOperation({
        summary: "Find address by ID",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: access to any address
        ${UserRole.CUSTOMER}: access to own address only
        `
    })
    @ApiParam({ name: "id", description: "Address id" })
    @ApiOkResponse({ type: AddressDto })
    async getOne(
        @Param("id", ParseIntPipe) id: number,
        @User("id") userId: number
    ): Promise<Address> {
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
    @UseInterceptors(InjectUserInterceptor)
    @ApiOperation({
        summary: "Create a new address",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: create address for any user
        ${UserRole.CUSTOMER}: create own address
        `

    })
    @ApiCreatedResponse({ type: AddressDto })
    async create(@Body() createAddressDto: CreateAddressDto, @User("id") userId: number) {
        try {

            if (!createAddressDto.userId)
                createAddressDto.userId = userId;

            const address = await this.addressesService.create(createAddressDto);

            return address
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
    @UseInterceptors(InjectUserInterceptor)
    @UseGuards(OwnerShipGuard)
    @ApiOperation({
        summary: "Update address",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: update any address
        ${UserRole.CUSTOMER}: update own addresses only
        `
    })
    @ApiParam({ description: "address id", name: 'id' })
    @ApiOkResponse({ type: AddressDto })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAddressDto: UpdateAddressDto,
        @User("id") userId: number
    ) {
        try {

            if (!updateAddressDto.userId)
                updateAddressDto.userId = userId;

            const address = await this.addressesService.update(id, updateAddressDto);

            return address
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
    @UseGuards(OwnerShipGuard)
    @ApiOperation({
        summary: "Delete address",
        description: `
        Role Required:
        ${UserRole.ADMIN} - ${UserRole.MANAGER}: delete any address
        ${UserRole.CUSTOMER}: delete own addresses only
        `
    })
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
