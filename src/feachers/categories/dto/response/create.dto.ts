import { OmitType } from "@nestjs/swagger";
import { CategoryDto } from "./category.dto";

export class CreateCategoryResponse extends OmitType(CategoryDto, ["attributes", "brands", "subCategories", "image", "totalProducts"]) { } 