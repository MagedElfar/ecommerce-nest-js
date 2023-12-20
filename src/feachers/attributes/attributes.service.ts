import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attribute } from './attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { IAttribute } from './attribute.interface';

@Injectable()
export class AttributesService {
    constructor(
        @InjectModel(Attribute)
        private readonly attributeModel: typeof Attribute
    ) { }

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
}
