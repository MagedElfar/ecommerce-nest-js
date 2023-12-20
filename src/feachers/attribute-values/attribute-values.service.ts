import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AttributeValues } from './attribute-values.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IAttributeValue } from './attribute-values.interface';

@Injectable()
export class AttributeValuesService {
    constructor(
        @InjectModel(AttributeValues)
        private readonly attributeValueModel: typeof AttributeValues
    ) { }

    async create(createAttributeValueDto: CreateAttributeValueDto): Promise<IAttributeValue> {
        try {
            let value = await this.findOne({ ...createAttributeValueDto });

            if (value) throw new BadRequestException("this attribute already has this value")

            value = await this.attributeValueModel.create(createAttributeValueDto);

            return value["dataValues"]
        } catch (error) {

            console.log(error)
            if (error.name === "SequelizeForeignKeyConstraintError") {
                throw new NotFoundException("Attribute isn't exsist");
            }
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
}
