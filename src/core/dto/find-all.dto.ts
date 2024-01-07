import { ApiPropertyOptional } from "@nestjs/swagger";


export class FindAllDto<Rows> {

    @ApiPropertyOptional({
        description: "total number of model records "
    })
    count: number
}