import { ProductVariationImage } from './../../feachers/products-variations-images/products-variations-images.entity';
import { AttributeValues } from "src/feachers/attributes-values/attributes-values.entity";
import { Attribute } from "src/feachers/attributes/attribute.entity";
import { BrandImage } from "src/feachers/brands-images/brands-images.entity";
import { Brand } from "src/feachers/brands/brands.entity";
import { CategoriesAttribute } from 'src/feachers/categories-attributes/categories-attributes.entity';
import { CategoryImage } from "src/feachers/categories-images/categories-images.entity";
import { Category } from "src/feachers/categories/categories.entity";
import { ProductImage } from "src/feachers/products-images/products-images.entity";
import { ProductSubCategory } from "src/feachers/products-sub-categories/products-sub-categories.entity";
import { ProductVariationAttribute } from "src/feachers/products-variations-attributes/products-variations-attributes.entity";
import { ProductVariations } from "src/feachers/products-variations/products-variations.entity";
import { Product } from "src/feachers/products/products.entity";
import { SubCategoryImage } from "src/feachers/sub-categories-images/sub-categories-images.entity";
import { SubCategory } from "src/feachers/sub-categories/sub-categories.entity";
import { UserImages } from "src/feachers/users-images/users-images.entity";
import { User } from "src/feachers/users/user.entity";

export const models: any[] = [
    User,
    UserImages,
    Category,
    CategoryImage,
    CategoriesAttribute,
    SubCategory,
    SubCategoryImage,
    Brand,
    BrandImage,
    Product,
    ProductImage,
    ProductVariations,
    Attribute,
    AttributeValues,
    ProductVariationAttribute,
    ProductSubCategory,
    ProductVariationImage
]