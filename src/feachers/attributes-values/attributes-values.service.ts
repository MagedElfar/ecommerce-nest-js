import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AttributeValues } from './attributes-values.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IAttributeValue } from './attributes-values.interface';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AttributeValuesService {
    constructor(
        @InjectModel(AttributeValues)
        private readonly attributeValueModel: typeof AttributeValues,
        private sequelize: Sequelize,
    ) { }


    async create(createAttributeValueDto: CreateAttributeValueDto): Promise<IAttributeValue> {
        try {
            let value = await this.findOne({ ...createAttributeValueDto });

            if (value) throw new BadRequestException("this attribute already has this value")

            value = await this.attributeValueModel.create(createAttributeValueDto);

            return value["dataValues"]
        } catch (error) {

            throw error;
        }
    }

    async findOne(data: Partial<Omit<IAttributeValue, "attribute">>): Promise<IAttributeValue | null> {
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
        t?: Transaction
    ): Promise<IAttributeValue | null> {
        const transaction = t || await this.sequelize.transaction()
        try {
            const value = await this.attributeValueModel.findByPk(id, { transaction: t });

            if (!value) return null;

            return t ? value : value["dataValues"];
        } catch (error) {
            await transaction.rollback()
            throw error
        } finally {
            if (!t) await transaction.commit()
        }
    }
}
