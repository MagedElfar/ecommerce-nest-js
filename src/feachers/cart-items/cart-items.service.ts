import { ICartItem } from './interfaces/cart-item.interface';
import { UpdateItemDto } from './dto/update-item.dto';
import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CartItem, CartItemScope } from './entities/cart-item-entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariationsService } from '../products-variations/products-variations.service';
import { CartsService } from '../carts/carts.service';
import { CreateItemDto } from './dto/create-item-dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { VariationScope } from '../products-variations/entities/products-variations.entity';
import { IProductVariation } from '../products-variations/interfaces/products-variations.interface';

@Injectable()
export class CartItemsService {
    constructor(
        @InjectModel(CartItem)
        private readonly cartItemModel: typeof CartItem,
        private readonly variationServices: ProductVariationsService,
        @Inject(forwardRef(() => CartsService))
        private readonly cartServices: CartsService,
        private readonly sequelize: Sequelize,
    ) { }

    private calculateTotal(variant: IProductVariation, quantity: number) {
        const product = variant.product

        const price = variant.price || product.price

        return quantity * price
    }

    async create(createItemDto: CreateItemDto): Promise<CartItem> {
        try {
            const { userId, ...itemDto } = createItemDto
            let cart = await this.cartServices.findOne({ userId });

            //check if user has cart and create new one if doesn't have 
            if (!cart) cart = await this.cartServices.create({ userId });

            const variant = await this.variationServices.findOneById(createItemDto.variantId, [
                VariationScope.WITH_MEDIA,
                VariationScope.WITH_PRODUCT_MAIN_INFO
            ]);

            if (!variant) throw new NotFoundException("product not found")

            //check if cart has item
            const cartItem = await this.findOne({
                cartId: cart.id,
                variantId: createItemDto.variantId
            })

            if (cartItem) throw new ConflictException("item already exist you can delete or update it")

            const total = this.calculateTotal(variant, createItemDto.quantity);

            const item = await this.cartItemModel.create(
                {
                    ...itemDto,
                    cartId: cart.id,
                    total
                }
            )

            return await this.findOneById(item["dataValues"].id, [
                CartItemScope.WITH_PRODUCT
            ])
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number, scopes: string[] = []): Promise<CartItem> {
        try {

            const item = await this.cartItemModel.scope(scopes).findByPk(id)

            if (!item) return null;

            return item["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: ICartItem, scopes: string[] = []): Promise<CartItem> {
        try {

            const item = await this.cartItemModel.scope(scopes).findOne({ where: data })

            if (!item) return null;

            return item["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async updated(id: number, updateItemDto: UpdateItemDto) {
        try {

            const { quantity, userId } = updateItemDto

            const item = await this.findOneById(id, [
                CartItemScope.WITH_PRODUCT,
                CartItemScope.WITH_CART
            ])

            if (!item) throw new NotFoundException();

            if (item.cart.userId !== userId) throw new ForbiddenException();

            const total = this.calculateTotal(item.variant, quantity)

            await this.cartItemModel.update({ quantity, total }, { where: { id } });

            return await this.findOneById(id)
        } catch (error) {
            throw error
        }
    }

    async delete(id: number, userId: number) {
        try {


            const item = await this.findOneById(id, [CartItemScope.WITH_CART])

            if (!item) throw new NotFoundException();

            if (item.cart.userId !== userId) throw new ForbiddenException();

            await this.cartItemModel.destroy({ where: { id } });

            return
        } catch (error) {
            throw error
        }
    }

    async deleteCartItems(cartId: number, t?: Transaction): Promise<void> {
        const transaction = t || await this.sequelize.transaction()
        try {

            const isDeleted = await this.cartItemModel.destroy({
                where: { cartId },
                transaction
            })

            if (!isDeleted) throw new NotFoundException();

            if (!t) await transaction.commit()
            return
        } catch (error) {
            if (!t) await transaction.rollback()
            throw error
        }
    }
}
