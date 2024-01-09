import { OmitType } from "@nestjs/swagger";
import { CategoryDto } from "./category.dto";

export class FindCategoriesDto extends OmitType(CategoryDto, ["attributes", "brands", "subCategories"]) { } 