import { Injectable } from "@nestjs/common";
import { IOrderItem } from "../orders-items/order-item.interface";
import { ProductsService } from "../products/services/products.service";

@Injectable()
export class OrdersHelper {

    constructor(private readonly productsService: ProductsService) { }

    async calculateOrderTotal(items: IOrderItem[]): Promise<number> {
        let sum = 0

        await Promise.all(items.map(async item => {
            const product = await this.productsService.findOne({ id: item.productId });
            sum += parseFloat(`${item.quantity * product.price}`)

            sum = parseFloat(sum.toFixed(2))
        }))

        return sum

    }


}
