import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AttributeValues } from './attributes-values.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IAttributeValue } from './attributes-values.interface';
import { Sequelize } from 'sequelize-typescript';
import { CreateAttributeValueDto } from './dto/request/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/request/update-attribute-value.dto';

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
    ): Promise<IAttributeValue | null> {
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

    async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto): Promise<IAttributeValue> {
        try {

            let value = await this.findOneById(id);

            console.log("value = ", value)
            console.log("id = ", id)


            if (!value) throw new NotFoundException();

            await this.attributeValueModel.update<AttributeValues>(updateAttributeValueDto, { where: { id } })

            return {
                ...value,
                ...updateAttributeValueDto,
            }
        } catch (error) {

            throw error
        }
    }
}
