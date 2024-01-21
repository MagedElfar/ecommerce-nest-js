import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { BaseDto } from "src/core/dto/base-model.dto";


export class PhoneDto extends BaseDto {

    @ApiProperty({
        description: "phone number",
        example: "+201113556988"
    })
    phone: string

    @ApiProperty({
        description: "user ID",
        example: 1
    })
    userId: number
}