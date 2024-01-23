import { AttributeValueRepository } from './attribute-value.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AttributeValue } from './entities/attribute-value.entity';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { IAttributeValue } from './interface/attribute-value.interface';

@Injectable()
export class AttributeValuesService {
    constructor(
        private readonly attributeValueRepository: AttributeValueRepository,
    ) { }


    async create(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
        try {

            const { attributeId, value } = createAttributeValueDto;

            const attrValue = await this.findOne({ attributeId, value });

            if (attrValue) throw new ConflictException("this attribute already has this value")

            return await this.attributeValueRepository.create(createAttributeValueDto);

        } catch (error) {
            throw error;
        }
    }

    async findOne(where: IAttributeValue, scope: string[] = []): Promise<AttributeValue | null> {
        try {
            return await this.attributeValueRepository.findOne({ where, scope });
        } catch (error) {
            throw error
        }
    }

    async findById(id: number, scope: string[] = []): Promise<AttributeValue | null> {
        try {
            return await this.attributeValueRepository.findById(id, scope);
        } catch (error) {
            throw error
        }
    }

    async delete(
        id: number,
    ): Promise<void> {
        try {
            const isDeleted = await this.attributeValueRepository.delete(id);

            if (!isDeleted) throw new NotFoundException("Attribute value not found")

            return;
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto): Promise<AttributeValue> {
        try {

            const affectedRowsCount = await this.attributeValueRepository.update(id, updateAttributeValueDto)

            if (affectedRowsCount === 0) {
                throw new NotFoundException('Address not found');
            }

            return await this.findById(id)
        } catch (error) {

            throw error
        }
    }
}
