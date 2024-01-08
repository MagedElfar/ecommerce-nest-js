import { UpdateAddressDto } from './dto/request/update-address.dto';
import { CreateAddressDto } from './dto/request/create-address.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Address } from './address.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IAddress } from './address.interface';
import { AddressQueryDto } from './dto/request/address-query.dto';

@Injectable()
export class AddressesService {

    constructor(
        @InjectModel(Address)
        private readonly addressModel: typeof Address
    ) { }

    async findAll(addressQueryDto: AddressQueryDto, scope: string[] = []) {
        try {

            const { limit, page } = addressQueryDto

            const result = await this.addressModel.scope(scope).findAndCountAll({
                where: { userId: addressQueryDto.userId },
                limit,
                offset: (page - 1) * limit
            });

            return result
        } catch (error) {
            throw error
        }
    }


    async create(createAddressDto: CreateAddressDto): Promise<IAddress> {
        try {

            const address = await this.addressModel.create(createAddressDto);

            return address["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<IAddress>, scope: string[] = []): Promise<IAddress | null> {
        try {
            const address = await this.addressModel.scope(scope).findOne({ where: data });

            if (!address) return null

            return address["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number, scope: string[] = []): Promise<IAddress | null> {
        try {
            const address = await this.addressModel.scope(scope).findByPk(id);

            if (!address) return null

            return address["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateAddressDto: UpdateAddressDto): Promise<IAddress | null> {
        try {

            const address = await this.findOne({
                id,
                userId: updateAddressDto.userId
            });

            if (!address)
                throw new NotFoundException();

            await this.addressModel.update(updateAddressDto, { where: { id } })

            return await this.findOneById(id)
        } catch (error) {
            throw error
        }
    }

    async delete(id: number, userId: number): Promise<void> {
        try {
            const address = await this.findOne({ id, userId });

            if (!address)
                throw new NotFoundException();

            await this.addressModel.destroy({ where: { id } })
            return;
        } catch (error) {
            throw error
        }
    }
}
