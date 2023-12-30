import { IModel } from 'src/core/interface/model.interface';
import { User } from '../users/user.entity';
import { CartItem } from '../cart-items/cart-item-entity';
import { Cart } from '../carts/carts.entity';
import { Product } from '../products/products.entity';
import { ProductVariations } from '../products-variations/products-variations.entity';

export interface ICartItem extends IModel {

    total?: number

    quantity?: number

    cartId?: number

    cart?: Cart;

    productId?: number

    product?: Product;

    variantId?: number

    variant?: ProductVariations;
}