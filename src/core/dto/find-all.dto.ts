import { ApiPropertyOptional } from "@nestjs/swagger";


export class FindAllDto<Rows> {

    @ApiPropertyOptional({
        description: "total number of model records ",
        example: 1
    })
    count: number
}