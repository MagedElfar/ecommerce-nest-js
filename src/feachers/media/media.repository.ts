import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/core/repositories/base.repository";
import { InjectModel } from "@nestjs/sequelize";
import { Media } from "./entities/media.entity";

@Injectable()
export class MediaRepository extends BaseRepository<Media>{
    constructor(
        @InjectModel(Media)
        private readonly mediaModel: typeof Media
    ) {
        super(mediaModel)
    }
}