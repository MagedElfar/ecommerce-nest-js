import { UpdateCartDto } from './dto/update-cart-dto';
import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './entities/carts.entity';
import { CreateCartDto } from './dto/create-cart-dto';
import { CartItemsService } from '../cart-items/cart-items.service';
import { ICart } from './interface/cart.interface';

@Injectable()
export class CartsService {
    constructor(
        @InjectModel(Cart)
        private readonly cartModel: typeof Cart,
        @Inject(forwardRef(() => CartItemsService))
        private readonly cartItemsService: CartItemsService
    ) { }


    async create(createCartDto: CreateCartDto): Promise<Cart> {
        try {
            const cart = await this.cartModel.create<Cart>(createCartDto)

            return cart["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Omit<ICart, "items">, scopes: string[] = []): Promise<Cart | null> {
        try {

            const cart = await this.cartModel.scope(scopes).findOne({ where: data })

            if (!cart) return null

            return cart["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async findOneById(id: number, scopes: string[] = []): Promise<Cart> {
        try {

            const cart = await this.cartModel.scope(scopes).findByPk(id)

            return cart["dataValues"]
        } catch (error) {
            throw error
        }
    }

    async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
        try {

            let cart = await this.findOneById(id)

            if (!cart) throw new NotFoundException();

            await this.cartModel.update(updateCartDto, {
                where: { id }
            })

            return await this.findOneById(id)
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
