import { OmitType } from "@nestjs/swagger";
import { SubCategoryDto } from "../request/sub-category.dto";

export class FindSubCategoriesDto extends OmitType(SubCategoryDto, ["totalProducts"]) { }