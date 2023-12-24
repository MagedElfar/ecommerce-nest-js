import { AttributeValues } from "src/feachers/attribute-values/attribute-values.entity";
import { Attribute } from "src/feachers/attributes/attribute.entity";
import { BrandImage } from "src/feachers/brands-image/brands-image.entity";
import { Brand } from "src/feachers/brands/brands.entity";
import { Category } from "src/feachers/categories/category.entity";
import { CategoryImage } from "src/feachers/category-image/category-image.entity";
import { ProductVariations } from "src/feachers/product-variations/product-variations.entity";
import { ProductVariationAttribute } from "src/feachers/product_variation_attributes/product_variation_attributes.entity";
import { Product } from "src/feachers/products/product.entity";
import { SubCategory } from "src/feachers/sub-categories/sub-category.entity";
import { SubCategoryImage } from "src/feachers/sub-category-image/sub-category-image.entity";
import { UserImages } from "src/feachers/users-images/users-images.entity";
import { User } from "src/feachers/users/user.entity";

export const models = [
    User,
    UserImages,
    Category,
    CategoryImage,
    SubCategory,
    SubCategoryImage,
    Brand,
    BrandImage,
    Product,
    ProductVariations,
    Attribute,
    AttributeValues,
    ProductVariationAttribute
]