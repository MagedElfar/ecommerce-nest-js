import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Address } from './address.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IAddress } from './address.interface';
import { AddressQueryDto } from './dto/adress-query.dto';

@Injectable()
export class AddressesService {

    constructor(
        @InjectModel(Address)
        private readonly addressModel: typeof Address
    ) { }

    async findAll(addressQueryDto: AddressQueryDto) {
        try {

            const { limit, page } = addressQueryDto

            const result = await this.addressModel.findAndCountAll({
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

    async findOne(data: Partial<IAddress>): Promise<IAddress | null> {
        try {
            const address = await this.addressModel.findOne({ where: data });

            if (!address) return null

            return address["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<IAddress | null> {
        try {
            const address = await this.addressModel.findByPk(id);

            if (!address) return null

            return address["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateAddressDto: UpdateAddressDto): Promise<IAddress | null> {
        try {

            const address = await this.findOneById(id);

            if (!address || address.userId !== updateAddressDto.userId)
                throw new ForbiddenException(
                    "address no exist or you don't have permission for that operation"
                );

            await this.addressModel.update(updateAddressDto, { where: { id } })

            return {
                ...address,
                ...updateAddressDto
            }
        } catch (error) {
            throw error
        }
    }

    async delete(id: number, userId: number): Promise<void> {
        try {
            const address = await this.addressModel.findByPk(id);

            if (!address || address.userId !== userId)
                throw new ForbiddenException(
                    "address no exist or you don't have permission for that operation"
                );

            await this.addressModel.destroy({ where: { id } })
            return;
        } catch (error) {
            throw error
        }
    }
}
