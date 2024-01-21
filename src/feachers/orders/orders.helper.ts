import { Injectable } from "@nestjs/common";
import { IProductVariation } from "../products-variations/interfaces/products-variations.interface";
import { OrderItem } from "../orders-items/entities/order-item-entity";
import { IOrderItem } from "../orders-items/interfaces/order-item.interface";

@Injectable()
export class OrdersHelper {


    calculateOrderTotal(items: IOrderItem[], variants: IProductVariation[]): number {
        let sum = 0

        variants.forEach(async variant => {
            const item = items.find(item => item.variantId === variant.id)

            const price = variant.price || variant.product.price
            const quantity = item.quantity

            sum += parseFloat(`${quantity * price}`)

            sum = parseFloat(sum.toFixed(2))
        })

        return sum

    }


}
