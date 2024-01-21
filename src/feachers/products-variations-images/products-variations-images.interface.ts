import { IMedia } from "../media/interfaces/media.interface";

export interface IProductVariationImage extends IMedia {
    variationId?: number;
    imageId?: number;
}