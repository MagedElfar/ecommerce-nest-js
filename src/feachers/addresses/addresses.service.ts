import { AddressRepository } from './address.repository';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Address } from './entities/address.entity';
import { AddressQueryDto } from './dto/address-query.dto';
import { IAddress } from './interfaces/address.interface';

@Injectable()
export class AddressesService {

    constructor(private readonly addressRepository: AddressRepository) { }

    async findAll(addressQueryDto: AddressQueryDto, scope: string[] = []) {
        try {

            const { limit, page, userId } = addressQueryDto

            const result = await this.addressRepository.findAndCountAll({
                where: { userId },
                options: { limit, offset: page },
                scope
            })


            return result
        } catch (error) {
            throw error
        }
    }


    async create(createAddressDto: CreateAddressDto): Promise<Address> {
        try {

            const address = await this.addressRepository.create(createAddressDto);

            return address
        } catch (error) {
            throw error
        }
    }

    async findOne(where: IAddress, scope: string[] = []): Promise<Address | null> {
        try {

            return await this.addressRepository.findOne({ where, scope });

        } catch (error) {
            throw error
        }
    }

    async findById(id: number, scope: string[] = []): Promise<Address | null> {
        try {

            return await this.addressRepository.findById(id, scope)

        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
        try {

            const affectedRowsCount = await this.addressRepository.update(id, updateAddressDto);

            if (affectedRowsCount === 0)
                throw new NotFoundException('Address not found');

            return await this.findById(id);

        } catch (error) {
            throw error
        }
    }

    async delete(id: number, userId: number): Promise<void> {
        try {

            const isDeleted = await this.addressRepository.delete(id)

            if (!isDeleted)
                throw new NotFoundException();

            return;
        } catch (error) {
            throw error
        }
    }
}
