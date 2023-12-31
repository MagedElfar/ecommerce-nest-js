import { UpdateItemDto } from './dto/update-item.dto';
import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CartItem } from './cart-item-entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariationsService } from '../products-variations/products-variations.service';
import { CartsService } from '../carts/carts.service';
import { CreateItemDto } from './dto/create-item-dto';
import { ICartItem } from './cart-items-interface';
import { ProductVariations } from '../products-variations/products-variations.entity';
import { Product } from '../products/products.entity';
import { Cart } from '../carts/carts.entity';
import { Media } from '../media/media.entity';

@Injectable()
export class CartItemsService {
    constructor(
        @InjectModel(CartItem)
        private readonly cartItemModel: typeof CartItem,
        private readonly variationServices: ProductVariationsService,
        @Inject(forwardRef(() => CartsService))
        private readonly cartServices: CartsService
    ) { }

    async create(createItemDto: CreateItemDto): Promise<ICartItem> {
        try {
            const { userId, ...itemDto } = createItemDto
            let cart = await this.cartServices.findOne({ userId });

            //check if user has cart and create new one if doesn't have 
            if (!cart) cart = await this.cartServices.create({ userId });

            const variant = await this.variationServices.findOneById(createItemDto.variantId);

            if (!variant) throw new NotFoundException("product not found")

            const total = createItemDto.quantity * variant.product.price;

            const item = await this.cartItemModel.create(
                {
                    ...itemDto,
                    cartId: cart.id,
                    productId: variant.product.id,
                    total
                },
                {
                    include: [
                        {
                            model: ProductVariations,
                            attributes: ["id", "name"],
                        },
                        {
                            model: Product,
                            attributes: ["id", "price", "name"],
                            include: [{
                                model: Media,
                                attributes: ["id", "url"]
                            }]
                        }
                    ]
                }
            )

            return item["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<ICartItem> {
        try {

            const item = await this.cartItemModel.findByPk(
                id,
                {
                    include: [
                        {
                            model: Cart,
                            attributes: ["id", "userId"]
                        },
                        {
                            model: Product,
                            attributes: ["price"]
                        }
                    ]
                }
            )

            if (!item) return null;

            return item["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async updated(id: number, updateItemDto: UpdateItemDto) {
        try {

            const { quantity, userId } = updateItemDto

            const item = await this.findOneById(id)

            if (!item) throw new NotFoundException();

            if (item.cart.userId !== userId) throw new ForbiddenException();

            const total = updateItemDto.quantity * item.product.price;

            await this.cartItemModel.update({ quantity, total }, { where: { id } });

            return {
                ...item,
                quantity,
                total
            }
        } catch (error) {
            throw error
        }
    }

    async delete(id: number, userId: number) {
        try {


            const item = await this.findOneById(id)

            if (!item) throw new NotFoundException();

            if (item.cart.userId !== userId) throw new ForbiddenException();


            const isDeleted = await this.cartItemModel.destroy({ where: { id } });

            return
        } catch (error) {
            throw error
        }
    }

    async deleteCartItems(cartId: number): Promise<void> {
        try {

            const isDeleted = await this.cartItemModel.destroy({ where: { cartId } })

            if (!isDeleted) throw new NotFoundException();

            return
        } catch (error) {
            throw error
        }
    }
}
