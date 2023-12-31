import { UpdateCartDto } from './dto/update-cart-dto';
import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './carts.entity';
import { CreateCartDto } from './dto/create-cart-dto';
import { ICart } from './carts.interface';
import { CartItem } from '../cart-items/cart-item-entity';
import { ProductVariations } from '../products-variations/products-variations.entity';
import { Product } from '../products/products.entity';
import { CartItemsService } from '../cart-items/cart-items.service';
import { Media } from '../media/media.entity';

@Injectable()
export class CartsService {
    constructor(
        @InjectModel(Cart)
        private readonly cartModel: typeof Cart,
        @Inject(forwardRef(() => CartItemsService))
        private readonly cartItemsService: CartItemsService
    ) { }


    async create(createCartDto: CreateCartDto): Promise<ICart> {
        try {
            const cart = await this.cartModel.create<Cart>(createCartDto)

            return cart["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<Omit<ICart, "user">>): Promise<ICart | null> {
        try {

            const cart = await this.cartModel.findOne(
                {
                    where: data,
                    include: [{
                        model: CartItem,
                        attributes: ["id", "total", "quantity"],
                        include: [
                            {
                                model: ProductVariations,
                                attributes: ["id", "sku", "quantity", "name"],
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
                    }]
                }
            )

            if (!cart) return null

            return cart["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number): Promise<ICart> {
        try {

            const cart = await this.cartModel.findByPk(id)

            return cart["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateCartDto: UpdateCartDto): Promise<ICart> {
        try {

            let cart = await this.findOneById(id)

            if (!cart) throw new NotFoundException();

            await this.cartModel.update(updateCartDto, {
                where: { id }
            })

            return {
                ...cart,
                ...updateCartDto
            }
        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<void> {
        try {

            const isDeleted = await this.cartModel.destroy({ where: { id } })

            if (!isDeleted) throw new NotFoundException();

            return
        } catch (error) {
            throw error
        }
    }

    async emptyCart(userId: number): Promise<void> {
        try {

            const cart = await this.findOne({ userId })

            if (!cart) throw new NotFoundException()

            if (cart.userId !== userId) throw new ForbiddenException()

            await this.cartItemsService.deleteCartItems(cart.id)

            return
        } catch (error) {
            throw error
        }
    }

}
