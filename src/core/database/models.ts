import { Address } from "src/feachers/addresses/address.entity";
import { AttributeValues } from "src/feachers/attributes-values/attributes-values.entity";
import { Attribute } from "src/feachers/attributes/attribute.entity";
import { Brand } from "src/feachers/brands/brands.entity";
import { CartItem } from 'src/feachers/cart-items/cart-item-entity';
import { Cart } from 'src/feachers/carts/carts.entity';
import { CategoriesAttribute } from 'src/feachers/categories-attributes/categories-attributes.entity';
import { CategoryBrand } from "src/feachers/categories-brands/categories-brand.entity";
import { Category } from "src/feachers/categories/categories.entity";
import { Media } from "src/feachers/media/media.entity";
import { OrderCancelReason } from "src/feachers/orders-cancel-reasons/order-cancel-reason.entity";
import { OrderItem } from "src/feachers/orders-items/order-item-entity";
import { Order } from "src/feachers/orders/order.entity";
import { PaymentMethod } from "src/feachers/payments-methods/payment-method.entity";
import { Payment } from "src/feachers/payments/payment.entity";
import { Phone } from "src/feachers/phones/phone.entity";
import { ProductSubCategory } from "src/feachers/products-sub-categories/products-sub-categories.entity";
import { ProductVariationAttribute } from "src/feachers/products-variations-attributes/products-variations-attributes.entity";
import { ProductVariationImage } from "src/feachers/products-variations-images/products-variations-images.entity";
import { ProductVariations } from "src/feachers/products-variations/products-variations.entity";
import { Product } from "src/feachers/products/products.entity";
import { SubCategory } from "src/feachers/sub-categories/sub-categories.entity";
import { User } from "src/feachers/users/user.entity";

export const models: any[] = [
    User,
    Category,
    CategoriesAttribute,
    SubCategory,
    Brand,
    Product,
    ProductVariations,
    Attribute,
    AttributeValues,
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
    CategoryBrand
]