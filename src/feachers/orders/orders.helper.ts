import { BadRequestException, Injectable } from "@nestjs/common";
import { ICartItem } from "../cart-items/cart-items-interface";

@Injectable()
export class OrdersHelper {
    quantityAvailability(items: ICartItem[]): void {
        items.forEach(item => {
            const quantity = item.quantity;
            const availableQuantity = item.variant.quantity

            if (quantity > availableQuantity)
                throw new BadRequestException(
                    `quantity is not available for product "${item.product.name}"`
                )
        })

        return
    }

    calculateOrderTotal(items: ICartItem[]): number {
        return items.reduce((sum, item) => {
            sum += parseFloat(`${item.total}`)
            return parseFloat(sum.toFixed(2))
        }, 0)
    }
}
