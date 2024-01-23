import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/core/repositories/base.repository";
import { InjectModel } from "@nestjs/sequelize";
import { Attribute } from "./entities/attribute.entity";

@Injectable()
export class AttributeRepository extends BaseRepository<Attribute>{
    constructor(
        @InjectModel(Attribute)
        private readonly attributeModel: typeof Attribute
    ) {
        super(attributeModel)
    }
}