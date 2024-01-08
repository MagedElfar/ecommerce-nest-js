import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attribute } from './attribute.entity';
import { CreateAttributeDto } from './dto/request/create-attribute.dto';
import { IAttribute } from './attribute.interface';
import { UpdateAttributeDto } from './dto/request/update-attribute.dto';

@Injectable()
export class AttributesService {
    constructor(
        @InjectModel(Attribute)
        private readonly attributeModel: typeof Attribute,
    ) { }

    async findAll(scopes: string[] = []): Promise<any> {
        try {

            const rows = await this.attributeModel.scope(scopes).findAll({
                group: ['values.id'],
            });

            const count = await this.attributeModel.count();

            return { rows, count };

        } catch (error) {
            throw error;
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

            throw error
        }
    }

    async update(id: number, updateAttributeDto: UpdateAttributeDto): Promise<IAttribute> {
        try {

            let attribute = await this.findOneById(id);

            if (!attribute) throw new NotFoundException("attribute not exist");

            await this.attributeModel.update<Attribute>(updateAttributeDto, { where: { id } })

            return {
                ...attribute,
                ...updateAttributeDto,
            }
        } catch (error) {

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
