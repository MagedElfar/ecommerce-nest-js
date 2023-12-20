import { AttributeValues } from "src/feachers/attribute-values/attribute-values.entity";
import { Attribute } from "src/feachers/attributes/attribute.entity";
import { BrandImage } from "src/feachers/brands-image/brands-image.entity";
import { Brand } from "src/feachers/brands/brands.entity";
import { Category } from "src/feachers/categories/category.entity";
import { CategoryImage } from "src/feachers/category-image/category-image.entity";
import { Product } from "src/feachers/products/product.entity";
import { UserImages } from "src/feachers/users-images/users-images.entity";
import { User } from "src/feachers/users/user.entity";

export const models = [
    User,
    UserImages,
    Category,
    CategoryImage,
    Brand,
    BrandImage,
    Product,
    Attribute,
    AttributeValues
]