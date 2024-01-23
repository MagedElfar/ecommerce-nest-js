import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/core/repositories/base.repository";
import { InjectModel } from "@nestjs/sequelize";
import { AttributeValue } from "./entities/attribute-value.entity";

@Injectable()
export class AttributeValueRepository extends BaseRepository<AttributeValue>{
    constructor(
        @InjectModel(AttributeValue)
        private readonly attributeValueModel: typeof AttributeValue
    ) {
        super(attributeValueModel)
    }
}