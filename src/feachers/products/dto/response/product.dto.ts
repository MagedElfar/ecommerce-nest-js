import { ApiProperty, PickType } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";
import { BrandDto } from "src/feachers/brands/dto/response/brand.dto";
import { CategoryDto } from "src/feachers/categories/dto/response/category.dto";
import { MediaDto } from "src/feachers/media/dto/media.dto";
import { VariationDto } from "src/feachers/products-variations/dto/response/variation.dto";
import { SubCategoryDto } from "src/feachers/sub-categories/dto/response/subCategory.dto";
import { UserDto } from "src/feachers/users/dto/response/user.dto";


class ProductCategory extends PickType(CategoryDto, ["id", "name", "slug"]) { }

class ProductSubCategory extends PickType(SubCategoryDto, ["id", "name", "slug"]) { }

export class ProductDto extends BaseDto {

    @ApiProperty({
        description: "product name",
        example: "product name"
    })
    name: string;

    @ApiProperty({
        description: "product slug",
        example: "product-name"
    })
    slug: string;

    @ApiProperty({
        description: "product description",
        example: "product description"
    })
    description: string

    @ApiProperty({
        description: "product price",
        example: 100.99
    })
    price: number

    @ApiProperty({
        description: "id for user created the product",
        example: 1
    })
    userId: number

    @ApiProperty({
        description: "user Object",
    })
    user: UserDto

    @ApiProperty({
        description: "product variations",
        isArray: true
    })
    variations: VariationDto

    @ApiProperty({
        description: "category id",
    })
    categoryId: number

    @ApiProperty({
        description: "category object",
    })
    category: ProductCategory

    @ApiProperty({
        description: "brand id",
    })
    brandId: number

    @ApiProperty({
        description: "brand object",
    })
    brand: BrandDto

    @ApiProperty({
        description: "image id",
    })
    imageId: number

    @ApiProperty({
        description: "image object",
    })
    image: MediaDto

    @ApiProperty({
        description: "subcategory object",
        isArray: true
    })
    subCategories: ProductSubCategory
}