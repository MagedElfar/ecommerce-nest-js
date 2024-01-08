import { OmitType } from "@nestjs/swagger";
import { BrandDto } from "./brand.dto";

export class CreateBrandResponseDto extends OmitType(BrandDto, ["image"]) { }
