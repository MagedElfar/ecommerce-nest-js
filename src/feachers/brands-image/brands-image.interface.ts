import { IMedia } from "src/core/interface/media.interface";
import { Brand } from "../brands/brands.entity";

export interface IBrandImage extends IMedia {
    brandId: number;
    brand: Brand
}