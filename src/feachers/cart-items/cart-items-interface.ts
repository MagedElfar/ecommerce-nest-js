import { IModel } from 'src/core/interface/model.interface';
import { User } from '../users/user.entity';
import { CartItem } from '../cart-items/cart-item-entity';
import { Cart } from '../carts/carts.entity';
import { Product } from '../products/products.entity';
import { } from '../products-variations/products-variations.entity';
import { IProductVariation } from '../products-variations/products-variations.interface';
import { IProduct } from '../products/products.interface';
import { ICart } from '../carts/carts.interface';

export interface ICartItem extends IModel {

    total?: number

    quantity?: number

    cartId?: number

    cart?: ICart;

    variantId?: number

    variant?: IProductVariation;
}