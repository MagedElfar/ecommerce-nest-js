import { IModel } from "src/core/interface/model.interface";
import { Category } from "../categories/categories.entity";
import { Brand } from "../brands/brands.entity";

export interface ICategoryBrand extends IModel {

    categoryId?: number;

    category?: Category;

    brand?: Brand;

    brandId?: number
}