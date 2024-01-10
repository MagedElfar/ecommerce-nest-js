import { Injectable } from "@nestjs/common";
import { IOrderItem } from "../orders-items/order-item.interface";
import { ProductsService } from "../products/services/products.service";
import { IProductVariation } from "../products-variations/products-variations.interface";

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
