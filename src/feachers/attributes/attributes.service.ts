import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
    constructor(
        @InjectModel(Attribute)
        private readonly attributeModel: typeof Attribute,
    ) { }

    async findAll(scopes: string[] = []): Promise<any> {
        try {

            const rows = await this.attributeModel.scope(scopes).findAll({
                group: ['Attribute.id', 'values.id'],
            });

            const count = await this.attributeModel.count();

            return { rows, count };

        } catch (error) {
            throw error;
        }
    }


    async findOneById(id: number, scopes: string[] = []): Promise<Attribute | null> {
        try {
            const attribute = await this.attributeModel.scope(scopes).findByPk(id)

            if (!attribute) return null;

            return attribute["dataValues"]
        } catch (error) {
            throw error
        }
    }


    async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
        try {

            const attribute = await this.attributeModel.create<Attribute>(createAttributeDto);

            return attribute["dataValues"];

        } catch (error) {

            throw error
        }
    }

    async update(id: number, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
        try {

            const [affectedRowsCount] = await this.attributeModel.update<Attribute>(updateAttributeDto, { where: { id } })

            if (affectedRowsCount === 0) {
                throw new NotFoundException('Attribute not found');
            }

            return await this.findOneById(id)

        } catch (error) {

            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {


            const isDeleted = await this.attributeModel.destroy({ where: { id } })

            if (!isDeleted) throw new NotFoundException();


            return
        } catch (error) {

            throw error
        }
    }
}
