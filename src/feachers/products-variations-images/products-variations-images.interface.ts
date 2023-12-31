import { IMedia } from "src/feachers/media/media.interface";
import { Media } from "../media/media.entity";

export interface IProductVariationImage extends IMedia {
    variationId?: number;
    imageId?: number;
    image?: IMedia
}