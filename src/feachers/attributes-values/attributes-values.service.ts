import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AttributeValue } from './entities/attribute-value.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { IAttributeValue } from './interface/attribute-value.interface';

@Injectable()
export class AttributeValuesService {
    constructor(
        @InjectModel(AttributeValue)
        private readonly attributeValueModel: typeof AttributeValue,
        private sequelize: Sequelize,
    ) { }


    async create(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
        try {
            let value = await this.findOne({ ...createAttributeValueDto });

            if (value) throw new BadRequestException("this attribute already has this value")

            value = await this.attributeValueModel.create(createAttributeValueDto);

            return value["dataValues"]
        } catch (error) {

            throw error;
        }
    }

    async findOne(data: IAttributeValue): Promise<AttributeValue | null> {
        try {

            const value = await this.attributeValueModel.findOne({ where: data });

            if (!value) return null;

            return value["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(
        id: number,
    ): Promise<AttributeValue | null> {
        try {
            const value = await this.attributeValueModel.findByPk(id);

            if (!value) return null;

            return value["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async delete(
        id: number,
    ): Promise<void> {
        try {
            const isDeleted = await this.attributeValueModel.destroy({ where: { id } })
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto): Promise<AttributeValue> {
        try {

            const [affectedRowsCount] = await this.attributeValueModel.update(updateAttributeValueDto, { where: { id } })

            if (affectedRowsCount === 0) {
                throw new NotFoundException('Address not found');
            }

            return await this.findOneById(id)
        } catch (error) {

            throw error
        }
    }
}
