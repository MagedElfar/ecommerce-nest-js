import { ModelCtor } from "sequelize-typescript";
import { Address } from "src/feachers/addresses/entities/address.entity";
import { AttributeValue } from "src/feachers/attributes-values/entities/attribute-value.entity";
import { Attribute } from "src/feachers/attributes/entities/attribute.entity";
import { RestToken } from "src/feachers/auth/entities/reset-token.entity";
import { Brand } from "src/feachers/brands/entities/brands.entity";
import { CartItem } from 'src/feachers/cart-items/entities/cart-item-entity';
import { Cart } from 'src/feachers/carts/entities/carts.entity';
import { CategoryAttribute } from 'src/feachers/categories-attributes/entities/categories-attributes.entity';
import { CategoryBrand } from "src/feachers/categories-brands/entities/categories-brand.entity";
import { Category } from "src/feachers/categories/entities/categories.entity";
import { Media } from "src/feachers/media/entities/media.entity";
import { OrderCancelReason } from "src/feachers/orders-cancel-reasons/entities/order-cancel-reason.entity";
import { OrderItem } from "src/feachers/orders-items/entities/order-item-entity";
import { Order } from "src/feachers/orders/entities/order.entity";
import { PaymentMethod } from "src/feachers/payments-methods/entities/payment-method.entity";
import { Payment } from "src/feachers/payments/entities/payment.entity";
import { Phone } from "src/feachers/phones/entities/phone.entity";
import { ProductSubCategory } from "src/feachers/products-sub-categories/entities/products-sub-categories.entity";
import { ProductVariationAttribute } from "src/feachers/products-variations-attributes/products-variations-attributes.entity";
import { ProductVariationImage } from "src/feachers/products-variations-images/products-variations-images.entity";
import { ProductVariations } from "src/feachers/products-variations/entities/products-variations.entity";
import { Product } from "src/feachers/products/entities/products.entity";
import { SubCategory } from "src/feachers/sub-categories/enities/sub-categories.entity";
import { User } from "src/feachers/users/user.entity";

export const models: ModelCtor[] = [
    User,
    Category,
    CategoryAttribute,
    SubCategory,
    Brand,
    Product,
    ProductVariations,
    Attribute,
    AttributeValue,
    ProductVariationAttribute,
    ProductSubCategory,
    Cart,
    CartItem,
    Media,
    ProductVariationImage,
    Address,
    Phone,
    Order,
    OrderItem,
    OrderCancelReason,
    Payment,
    PaymentMethod,
    CategoryBrand,
    RestToken
]

