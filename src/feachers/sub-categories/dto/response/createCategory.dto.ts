import { OmitType } from '@nestjs/swagger';
import { SubCategoryDto } from "../request/sub-category.dto";

export class CreateSubCategoryResponseDto extends OmitType(SubCategoryDto, ["image", "totalProducts"]) { }