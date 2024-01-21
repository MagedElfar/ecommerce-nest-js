import { IModel } from 'src/core/interface/model.interface';
import { ICartItem } from 'src/feachers/cart-items/interfaces/cart-item.interface';

export interface ICart extends IModel {

    userId?: number

    items?: ICartItem[]
}