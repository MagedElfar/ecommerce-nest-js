import { IModel } from "src/core/interface/model.interface";


export interface IProductSubCategory extends IModel {

    productId?: number;
    subCategoryId?: number;
}