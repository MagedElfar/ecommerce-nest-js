import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseSchema } from "./base.schema";
import { MediaSchema } from "./media.schema";
import { FindAllSchema } from "./find-all.schema";

export class CategorySchema extends BaseSchema {

    @ApiPropertyOptional({ description: "category name" })
    name: string;

    @ApiPropertyOptional({ description: "category slug" })
    slug: string;

    @ApiPropertyOptional({ description: "sub categories belongs to the category", isArray: true })
    subCategories: any

    @ApiPropertyOptional({ description: "category image id" })
    imageId: number

    @ApiPropertyOptional({ description: "image object" })
    image: MediaSchema

    @ApiPropertyOptional({ description: "brands belongs to the category", isArray: true })
    brands: any

    @ApiPropertyOptional({ description: "attributes belongs to the category", isArray: true })
    attributes: any;

    @ApiPropertyOptional({ description: "total category products" })
    totalProducts: number

}

export class FindAllCategoriesSchema extends FindAllSchema {

    @ApiPropertyOptional({
        description: "user array"
    })
    rows: CategorySchema
}

