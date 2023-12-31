import { ForbiddenException, Injectable } from '@nestjs/common';
import { Phone } from './phone.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { IPhone } from './phone.interface';
import { UpdatePhoneDto } from './dto/update-add.dto';

@Injectable()
export class PhonesService {
    constructor(
        @InjectModel(Phone)
        private readonly phoneModel: typeof Phone
    ) { }

    async create(createPhoneDto: CreatePhoneDto): Promise<IPhone> {
        try {
            const address = await this.phoneModel.create(createPhoneDto);

            return address["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<IPhone>): Promise<IPhone | null> {
        try {
            const phone = await this.phoneModel.findOne({ where: data });

            if (!phone) return null

            return phone["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<IPhone | null> {
        try {
            const phone = await this.phoneModel.findByPk(id);

            if (!phone) return null

            return phone["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updatePhoneDto: UpdatePhoneDto): Promise<IPhone | null> {
        try {

            const phone = await this.findOneById(id);

            if (!phone || phone.userId !== updatePhoneDto.userId)
                throw new ForbiddenException();

            await this.phoneModel.update(updatePhoneDto, { where: { id } })

            return {
                ...phone,
                ...updatePhoneDto
            }
        } catch (error) {
            throw error
        }
    }

    async delete(id: number, userId: number): Promise<void> {
        try {
            const address = await this.phoneModel.findByPk(id);

            if (!address || address.userId !== userId)
                throw new ForbiddenException();

            await this.phoneModel.destroy({ where: { id } })
            return;
        } catch (error) {
            throw error
        }
    }
}
