import { IModel } from "src/core/interface/model.interface";
import { BrandImage } from "../brands-image/brands-image.entity";

export interface IBrand extends IModel {
    name?: string
    slug?: string
    image?: BrandImage
}