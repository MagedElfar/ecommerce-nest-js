import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariationsService } from '../products-variations/products-variations.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { IProductVariation } from '../products-variations/interfaces/products-variations.interface';
import { IOrderItem } from '../orders-items/interfaces/order-item.interface';

@Injectable()
export class StockService {
    constructor(
        private readonly productVariationsService: ProductVariationsService,
        private readonly sequelize: Sequelize,
    ) { }

    checkSyncQuantity(items: IOrderItem[], variants: IProductVariation[]) {
        variants.forEach(variant => {
            const item = items.find(item => item.variantId === variant.id)

            if (item.quantity > variant.quantity)
                throw new BadRequestException(
                    `quantity is not available for product with sku "${variant.sku}"`
                )

            return
        })
    }

    async checkQuantity(items: IOrderItem[]): Promise<void> {
        try {


            await Promise.all(items.map(async item => {
                const variant = await this.productVariationsService.findOneById(item.variantId)

                if (!variant) throw new NotFoundException("variant not found")

                if (item.quantity > variant.quantity)
                    throw new BadRequestException(
                        `quantity is not available for product with sku "${variant.sku}"`
                    )

                return
            }))

            return
        } catch (error) {
            throw error
        }
    }

    async removeFromStock(variantId: number, quantity: number, t?: Transaction): Promise<void> {
        const transaction = t || await this.sequelize.transaction()
        try {
            const variant = await this.productVariationsService.findOneById(variantId)

            if (!variant) throw new NotFoundException("variant not found")

            await this.productVariationsService.update(
                variantId,
                { quantity: variant.quantity - quantity },
                transaction
            )

            if (!t) await transaction.commit()

            return
        } catch (error) {

            if (!t) await transaction.rollback()

            throw error
        }
    }

    async addToStock(variantId: number, quantity: number, t?: Transaction): Promise<void> {
        const transaction = t || await this.sequelize.transaction()

        try {
            const variant = await this.productVariationsService.findOneById(variantId)

            if (!variant) throw new NotFoundException("variant not found")

            await this.productVariationsService.update(
                variantId,
                { quantity: variant.quantity + quantity },
                transaction
            )

            if (!t) await transaction.commit()

            return
        } catch (error) {
            if (!t) await transaction.rollback()

            throw error
        }
    }
}
