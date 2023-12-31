import { AddressesService } from './addresses.service';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateBrandDto } from '../brands/dto/create-brands.dto';
import { UpdateBrandDto } from '../brands/dto/update-brand.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    async create(@Body() createAddressDto: CreateAddressDto, @User("id") userId: number) {
        try {

            createAddressDto.userId = userId;

            const address = await this.addressesService.create(createAddressDto);

            return { address }
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
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
