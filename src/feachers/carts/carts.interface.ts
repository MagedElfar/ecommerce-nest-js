import { IModel } from 'src/core/interface/model.interface';
import { User } from '../users/user.entity';
import { CartItem } from '../cart-items/cart-item-entity';

export interface ICart extends IModel {

    userId?: number

    user?: User;

    items?: CartItem[]
}