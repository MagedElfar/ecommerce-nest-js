import { AttributeRepository } from './attributes.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Op } from 'sequelize';
import { AttributeQueryDto } from './dto/attribute.query';
import { IAttribute } from './interfaces/attribute.interface';

@Injectable()
export class AttributesService {
    constructor(private readonly attributeRepository: AttributeRepository) { }

    async findAll(attributeQueryDto: AttributeQueryDto, scope: string[] = []): Promise<any> {
        try {

            const { limit, page, term } = attributeQueryDto;

            const rows = await this.attributeRepository.findAll({
                scope,
                where: { name: { [Op.iLike]: `%${term}%` } },
                options: {
                    group: ['Attribute.id'],
                    offset: page,
                    limit
                }
            });

            const count = await this.attributeRepository.countAll({
                where: { name: { [Op.iLike]: `%${term}%` } },
            })

            return { count, rows }

        } catch (error) {
            throw error;
        }
    }


    async findById(id: number, scope: string[] = []): Promise<Attribute> {
        try {

            return await this.attributeRepository.findById(id, scope)

        } catch (error) {
            throw error
        }
    }

    async findOne(where: IAttribute, scope: string[] = []): Promise<Attribute> {
        try {

            return await this.attributeRepository.findOne({ where })

        } catch (error) {
            throw error
        }
    }


    async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
        try {

            return await this.attributeRepository.create(createAttributeDto);

        } catch (error) {

            throw error
        }
    }

    async update(id: number, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
        try {

            const affectedRowsCount = await this.attributeRepository.update(id, updateAttributeDto)

            if (affectedRowsCount === 0)
                throw new NotFoundException('Attribute not found');


            return await this.findById(id)

        } catch (error) {

            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {


            const isDeleted = await this.attributeRepository.delete(id)

            if (!isDeleted) throw new NotFoundException('Attribute not found');

            return;
        } catch (error) {

            throw error
        }
    }
}
