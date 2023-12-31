import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { User } from 'src/core/decorators/user.decorator';
import { UpdateAddressDto } from '../addresses/dto/update-address.dto';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-add.dto';

@Controller('phones')
export class PhonesController {

    constructor(private readonly phonesService: PhonesService) { }

    @Post()
    async create(@Body() createPhoneDto: CreatePhoneDto, @User("id") userId: number) {
        try {

            createPhoneDto.userId = userId;

            const phone = await this.phonesService.create(createPhoneDto);

            return { phone }
        } catch (error) {
            throw error
        }
    }

    @Put(":id")
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
