import { IModel } from 'src/core/interface/model.interface';



export interface ICartItem extends IModel {

    total?: number

    quantity?: number

    cartId?: number

    variantId?: number
}