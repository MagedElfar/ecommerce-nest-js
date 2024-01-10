import { OmitType } from "@nestjs/swagger";
import { CreateItemDto } from "./create-item-dto";

export class UpdateItemDto extends OmitType(CreateItemDto, ["variantId"]) { }