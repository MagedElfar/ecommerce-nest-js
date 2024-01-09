import { OmitType } from "@nestjs/swagger";
import { SubCategoryDto } from "../request/sub-category.dto";

export class UpdateSubCategoryResponseDto extends OmitType(SubCategoryDto, ["totalProducts"]) { }