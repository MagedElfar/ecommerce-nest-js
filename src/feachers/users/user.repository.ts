import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/core/repositories/base.repository";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.entity";

@Injectable()
export class UserRepository extends BaseRepository<User>{
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User
    ) {
        super(userModel)
    }
}