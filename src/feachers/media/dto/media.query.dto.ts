import { IsDateString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { IsDateInRange } from "src/core/decorators/is-date-range.decorator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsValidDate } from "src/core/decorators/Is-valid-date.decorator";

export class MediaQueryDto extends QueryDto {
    @ApiPropertyOptional({
        description: "From date",
        format: "MM/DD/YYYY"
    })
    @IsValidDate()
    fromDate?: string;

    @ApiPropertyOptional({
        description: "to date",
        format: "MM/DD/YYYY"
    })
    @IsValidDate()
    @IsDateInRange("from")
    toDate?: string;
}