import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariationsService } from '../products-variations/products-variations.service';
import { Sequelize } from 'sequelize-typescript';
import { IOrderItem } from '../orders-items/order-item.interface';
import { Transaction } from 'sequelize';

@Injectable()
export class StockService {
    constructor(
        private readonly productVariationsService: ProductVariationsService,
        private readonly sequelize: Sequelize,
    ) { }

    async checkQuantity(items: IOrderItem[]): Promise<void> {
        try {
            await Promise.all(items.map(async item => {
                const variant = await this.productVariationsService.findOneById(item.variantId)

                if (!variant) throw new NotFoundException("variant not found")

                if (item.quantity > variant.quantity)
                    throw new BadRequestException(
                        `quantity is not available for product "${item.product.name}"`
                    )

                return
            }))

            return
        } catch (error) {
            throw error
        }
    }

    async removeFromStock(variantId: number, quantity: number, transaction: Transaction): Promise<void> {
        try {
            const variant = await this.productVariationsService.findOneById(variantId)

            if (!variant) throw new NotFoundException("variant not found")

            await this.productVariationsService.update(variantId, { quantity: variant.quantity - quantity })

            return
        } catch (error) {
            throw error
        }
    }

    async addToStock(variantId: number, quantity: number, transaction: Transaction): Promise<void> {
        try {
            const variant = await this.productVariationsService.findOneById(variantId)

            if (!variant) throw new NotFoundException("variant not found")

            await this.productVariationsService.update(variantId, { quantity: variant.quantity + quantity })

            return
        } catch (error) {
            throw error
        }
    }
}
