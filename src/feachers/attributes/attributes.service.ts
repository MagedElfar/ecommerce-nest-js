import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attribute } from './attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { IAttribute } from './attribute.interface';
import { AttributeValues } from '../attribute-values/attribute-values.entity';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
    constructor(
        @InjectModel(Attribute)
        private readonly attributeModel: typeof Attribute
    ) { }

    async findAll(): Promise<IAttribute[]> {
        try {
            const result = await this.attributeModel.findAll({
                include: [
                    {
                        model: AttributeValues,
                        attributes: ["id", "value"]
                    }
                ]
            })

            const attributes = result.map(item => item["dataValues"]);

            return attributes

        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<IAttribute | null> {
        try {
            const attribute = await this.attributeModel.findByPk(id, {})

            if (!attribute) return null;

            return attribute["dataValues"]
        } catch (error) {
            throw error
        }
    }


    async create(createAttributeDto: CreateAttributeDto): Promise<IAttribute> {
        try {

            const attribute = await this.attributeModel.create<Attribute>(createAttributeDto);

            return attribute["dataValues"];

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Product is already exist');
            }
            throw error
        }
    }

    async update(id: number, updateAttributeDto: UpdateAttributeDto): Promise<IAttribute> {
        try {

            let attribute = await this.findOneById(id);

            if (!attribute) throw new NotFoundException();

            await this.attributeModel.update<Attribute>(updateAttributeDto, { where: { id } })

            return {
                ...attribute,
                ...updateAttributeDto,
            }
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new BadRequestException('Attribute is already in exist');
            }

            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {

            let attribute = await this.findOneById(id);

            if (!attribute) throw new NotFoundException();

            await this.attributeModel.destroy({ where: { id } })

            return
        } catch (error) {

            throw error
        }
    }
}
