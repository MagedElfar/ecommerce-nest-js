import { OmitType } from "@nestjs/swagger";
import { AttributeDto } from "./attribute.dto";

export class UpdateAttributeResponseDto extends OmitType(AttributeDto, ["values"]) { }