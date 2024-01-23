import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/core/repositories/base.repository";
import { Address } from "./entities/address.entity";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class AddressRepository extends BaseRepository<Address>{
    constructor(
        @InjectModel(Address)
        private readonly addressModel: typeof Address
    ) {
        super(addressModel)
    }
}