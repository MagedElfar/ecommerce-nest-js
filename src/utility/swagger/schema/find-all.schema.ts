import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindAllSchema {

    @ApiPropertyOptional({
        description: "total of records in database"
    })
    count: number
}