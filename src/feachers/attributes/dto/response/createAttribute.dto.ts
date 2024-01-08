import { OmitType } from "@nestjs/swagger";
import { AttributeDto } from "./attribute.dto";

export class CreateAttributeResponseDto extends OmitType(AttributeDto, ["values"]) { }