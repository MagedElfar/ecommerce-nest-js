import { IModel } from 'src/core/interface/model.interface';
import { IUser } from '../users/users.interface';
import { ICartItem } from '../cart-items/cart-items-interface';
import { CartItem } from '../cart-items/cart-item-entity';

export interface ICart extends IModel {

    userId?: number

    user?: IUser;

    items?: CartItem[]
}