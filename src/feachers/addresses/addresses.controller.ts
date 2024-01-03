import { IAddress } from './address.interface';
import { AddressesService } from './addresses.service';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateAddressResponse } from './response-body/create-address.response';

@ApiTags("Addresses")
@Controller('addresses')
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    @ApiCreatedResponse({
        type: CreateAddressResponse
    })
    @ApiBody({
        type: CreateAddressDto,
        description: 'Create Address schema',
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
    @ApiBody({
        type: UpdateAddressDto,
        description: 'Update Address schema',
    })
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAddressDto: UpdateAddressDto,
        @User("id") userId: number
    ) {
        try {

            updateAddressDto.userId = userId;

            const address = await this.addressesService.update(id, updateAddressDto);

            return { address }
        } catch (error) {
            throw error
        }
    }

    @Delete(":id")
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
